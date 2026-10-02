<?php
/** Small same-origin CMS API for PHP hosts such as InfinityFree. */
declare(strict_types=1);
// InfinityFree may terminate HTTPS before PHP and expose the request as HTTP.
// Use a portable cookie name and derive the secure flag from the actual request.
session_name('portfolio_admin');
$requestIsHttps = (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
session_start(['cookie_path' => '/', 'cookie_httponly' => true, 'cookie_samesite' => 'Lax', 'cookie_secure' => $requestIsHttps, 'use_strict_mode' => true]);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

$config = __DIR__ . '/config.php';
if (!is_file($config)) { echo json_encode(['available' => true, 'configured' => false, 'authenticated' => false]); exit; }
$settings = require $config;
$dataDir = __DIR__ . '/data'; $dataFile = $dataDir . '/portfolio.json'; $uploadsDir = __DIR__ . '/uploads'; $privateDir = __DIR__ . '/private-documents'; $privateIndex = $privateDir . '/documents.json';
$action = $_GET['action'] ?? '';
function respond(array $data, int $code = 200): void { http_response_code($code); echo json_encode($data); exit; }
function loggedIn(): bool {
  global $settings;
  if (empty($_SESSION['portfolio_admin']) || empty($_SESSION['portfolio_admin_hash']) || !hash_equals((string) ($settings['password_hash'] ?? ''), (string) $_SESSION['portfolio_admin_hash'])) return false;
  if (time() - (int) ($_SESSION['portfolio_admin_last_activity'] ?? 0) > 7200) { unset($_SESSION['portfolio_admin'], $_SESSION['portfolio_admin_hash']); return false; }
  $_SESSION['portfolio_admin_last_activity'] = time(); return true;
}
function requireLogin(): void { if (!loggedIn()) respond(['ok' => false, 'error' => 'Please sign in.'], 401); }
function requireDocuments(): void {
  global $settings;
  $hash = (string) ($settings['document_password_hash'] ?? '');
  if (empty($_SESSION['documents_unlocked_hash']) || $hash === '' || !hash_equals($hash, (string) $_SESSION['documents_unlocked_hash']) || time() - (int) ($_SESSION['documents_unlocked_at'] ?? 0) > 7200) {
    unset($_SESSION['documents_unlocked_hash'], $_SESSION['documents_unlocked_at']); respond(['ok' => false, 'error' => 'Unlock the documents first.'], 401);
  }
}
function input(): array {
  if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 2 * 1024 * 1024) respond(['ok' => false, 'error' => 'Request is too large.'], 413);
  $raw = file_get_contents('php://input'); if (!is_string($raw)) return [];
  if (strlen($raw) > 2 * 1024 * 1024) respond(['ok' => false, 'error' => 'Request is too large.'], 413);
  $decoded = json_decode($raw, true); return is_array($decoded) ? $decoded : [];
}
function requireSameOriginPost(): void {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site')) respond(['ok' => false, 'error' => 'Request rejected.'], 403);
  $source = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($source === '' && !empty($_SERVER['HTTP_REFERER'])) $source = (string) $_SERVER['HTTP_REFERER'];
  $sourceHost = strtolower((string) parse_url($source, PHP_URL_HOST));
  $targetUrl = 'https://' . ($_SERVER['HTTP_HOST'] ?? '');
  $targetHost = strtolower((string) parse_url($targetUrl, PHP_URL_HOST));
  $sourcePort = (int) (parse_url($source, PHP_URL_PORT) ?: 443);
  $targetPort = (int) (parse_url($targetUrl, PHP_URL_PORT) ?: 443);
  $sourceScheme = strtolower((string) parse_url($source, PHP_URL_SCHEME));
  $targetScheme = $requestIsHttps ? 'https' : 'http';
  // Some shared-host/browser combinations omit Origin and Referer on same-origin
  // fetches. Sec-Fetch-Site still protects modern browsers; allow the absent-header
  // case so InfinityFree does not reject the studio login form.
  if ($sourceHost !== '' && ($sourceHost !== $targetHost || $sourcePort !== $targetPort || ($sourceScheme !== '' && $sourceScheme !== $targetScheme))) respond(['ok' => false, 'error' => 'Request rejected.'], 403);
}
function ensurePrivateDir(): bool {
  global $privateDir;
  if (!is_dir($privateDir) && !mkdir($privateDir, 0750, true)) return false;
  $guard = $privateDir . '/.htaccess';
  if (!is_file($guard) && file_put_contents($guard, "Require all denied\n", LOCK_EX) === false) return false;
  return true;
}
function attemptFile(): string { global $privateDir; return $privateDir . '/auth-attempts.json'; }
function authAttemptState(string $scope, bool $recordFailure, int $limit = 8, int $window = 3600): bool {
  global $settings;
  if (!ensurePrivateDir()) return true;
  $path = attemptFile(); $file = fopen($path, 'c+'); if (!$file || !flock($file, LOCK_EX)) { if ($file) fclose($file); return true; }
  rewind($file); $raw = stream_get_contents($file); $state = json_decode($raw ?: '{}', true); if (!is_array($state)) $state = [];
  $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'); $key = hash_hmac('sha256', $scope . '|' . $ip, (string) ($settings['password_hash'] ?? 'portfolio-rate-limit'));
  $storedTimes = is_array($state[$key] ?? null) ? $state[$key] : [];
  $times = array_values(array_filter($storedTimes, fn($time) => is_numeric($time) && time() - (int) $time < $window));
  $blocked = count($times) >= $limit;
  if ($recordFailure && !$blocked) { $times[] = time(); $state[$key] = $times; }
  else $state[$key] = $times;
  ftruncate($file, 0); rewind($file); fwrite($file, json_encode($state)); fflush($file); flock($file, LOCK_UN); fclose($file);
  @chmod($path, 0600);
  return $blocked;
}
function clearAuthAttempts(string $scope): void {
  global $settings;
  if (!ensurePrivateDir()) return;
  $path = attemptFile(); $file = fopen($path, 'c+'); if (!$file || !flock($file, LOCK_EX)) { if ($file) fclose($file); return; }
  rewind($file); $state = json_decode(stream_get_contents($file) ?: '{}', true); if (!is_array($state)) $state = [];
  $key = hash_hmac('sha256', $scope . '|' . (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), (string) ($settings['password_hash'] ?? 'portfolio-rate-limit'));
  unset($state[$key]); ftruncate($file, 0); rewind($file); fwrite($file, json_encode($state)); fflush($file); flock($file, LOCK_UN); fclose($file);
}
function saveSettings(array $next): bool {
  global $settings, $config;
  $temp = tempnam(__DIR__, '.admin-config-'); if ($temp === false) return false;
  $php = "<?php\nreturn " . var_export($next, true) . ";\n";
  if (file_put_contents($temp, $php, LOCK_EX) === false) { @unlink($temp); return false; }
  @chmod($temp, 0600);
  if (!rename($temp, $config)) { @unlink($temp); return false; }
  $settings = $next; if (function_exists('opcache_invalidate')) @opcache_invalidate($config, true);
  return true;
}
if ($action === 'status') respond(['available' => true, 'configured' => true, 'authenticated' => loggedIn()]);
if ($action === 'content') {
  $data = is_file($dataFile) ? json_decode((string) file_get_contents($dataFile), true) : null;
  respond(['data' => is_array($data) ? $data : null]);
}
if ($action === 'document-unlock') {
  requireSameOriginPost();
  if (authAttemptState('documents', false)) respond(['ok' => false, 'error' => 'Too many attempts. Try again in an hour.'], 429);
  $body = input(); $password = (string) ($body['password'] ?? ''); $hash = (string) ($settings['document_password_hash'] ?? '');
  if ($hash === '' || !password_verify($password, $hash)) {
    authAttemptState('documents', true);
    respond(['ok' => false, 'error' => 'That password was not accepted.'], 401);
  }
  clearAuthAttempts('documents');
  session_regenerate_id(true); $_SESSION['documents_unlocked_hash'] = $hash; $_SESSION['documents_unlocked_at'] = time(); respond(['ok' => true]);
}
if ($action === 'document-list') {
  requireDocuments(); header('Cache-Control: private, no-store, max-age=0'); $documents = is_file($privateIndex) ? json_decode((string) file_get_contents($privateIndex), true) : [];
  respond(['documents' => is_array($documents) ? $documents : []]);
}
if ($action === 'document-download') {
  requireDocuments(); $id = (string) ($_GET['id'] ?? '');
  if (!preg_match('/^[a-f0-9]{32}$/', $id)) respond(['ok' => false, 'error' => 'Document not found.'], 404);
  $documents = is_file($privateIndex) ? json_decode((string) file_get_contents($privateIndex), true) : [];
  $document = null; foreach (is_array($documents) ? $documents : [] as $item) if (($item['id'] ?? '') === $id) { $document = $item; break; }
  if (!$document || !preg_match('/^[a-f0-9]{32}\.(pdf|doc|docx|txt)$/', (string) ($document['stored'] ?? ''))) respond(['ok' => false, 'error' => 'Document not found.'], 404);
  $path = $privateDir . '/' . $document['stored']; if (!is_file($path)) respond(['ok' => false, 'error' => 'Document not found.'], 404);
  $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION)); $mime = $ext === 'pdf' ? 'application/pdf' : ($ext === 'txt' ? 'text/plain; charset=utf-8' : 'application/octet-stream');
  header('Content-Type: ' . $mime); header('Content-Length: ' . filesize($path)); header('X-Content-Type-Options: nosniff'); header('Cache-Control: private, no-store, max-age=0');
  header('Content-Disposition: attachment; filename="document.' . $ext . '"');
  readfile($path); exit;
}
if ($action === 'document-upload') {
  requireSameOriginPost(); requireLogin(); if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) respond(['ok' => false, 'error' => 'Upload failed.'], 422);
  $file = $_FILES['file']; if ($file['size'] > 25 * 1024 * 1024) respond(['ok' => false, 'error' => 'Maximum upload size is 25 MB.'], 422);
  $types = ['application/pdf' => 'pdf', 'application/msword' => 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx', 'text/plain' => 'txt'];
  $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']); if (!isset($types[$mime])) respond(['ok' => false, 'error' => 'Use PDF, Word, or plain text documents.'], 422);
  if (!ensurePrivateDir()) respond(['ok' => false, 'error' => 'Could not create the private document folder.'], 500);
  $id = bin2hex(random_bytes(16)); $stored = $id . '.' . $types[$mime];
  if (!move_uploaded_file($file['tmp_name'], $privateDir . '/' . $stored)) respond(['ok' => false, 'error' => 'Could not store the private document.'], 500);
  $documents = is_file($privateIndex) ? json_decode((string) file_get_contents($privateIndex), true) : [];
  if (!is_array($documents)) $documents = [];
  $title = trim(strip_tags((string) ($_POST['title'] ?? ''))); if ($title === '') $title = pathinfo((string) $file['name'], PATHINFO_FILENAME);
  $date = trim(strip_tags((string) ($_POST['date'] ?? '')));
  $documents[] = ['id' => $id, 'title' => substr($title, 0, 360), 'date' => substr($date, 0, 120), 'filename' => 'document.' . $types[$mime], 'stored' => $stored];
  if (file_put_contents($privateIndex, json_encode($documents, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT), LOCK_EX) === false) { unlink($privateDir . '/' . $stored); respond(['ok' => false, 'error' => 'Could not save document details.'], 500); }
  respond(['ok' => true]);
}
if ($action === 'login') {
  requireSameOriginPost();
  if (authAttemptState('admin', false)) respond(['ok' => false, 'error' => 'Too many sign-in attempts. Try again in an hour.'], 429);
  $body = input(); $password = (string) ($body['password'] ?? ''); $username = trim((string) ($body['username'] ?? ''));
  if (!hash_equals((string) ($settings['username'] ?? ''), $username) || !password_verify($password, (string) ($settings['password_hash'] ?? ''))) { authAttemptState('admin', true); respond(['ok' => false, 'error' => 'Incorrect username or password.'], 401); }
  clearAuthAttempts('admin'); session_regenerate_id(true); $_SESSION['portfolio_admin'] = true; $_SESSION['portfolio_admin_hash'] = (string) $settings['password_hash']; $_SESSION['portfolio_admin_last_activity'] = time(); respond(['ok' => true]);
}
if ($action === 'change-password') {
  requireSameOriginPost(); requireLogin(); $body = input();
  $current = (string) ($body['currentPassword'] ?? ''); $nextPassword = (string) ($body['newPassword'] ?? ''); $confirm = (string) ($body['confirmPassword'] ?? ''); $kind = (string) ($body['kind'] ?? '');
  if (!password_verify($current, (string) ($settings['password_hash'] ?? ''))) respond(['ok' => false, 'error' => 'Current admin password is incorrect.'], 401);
  if (strlen($nextPassword) < 12 || strlen($nextPassword) > 72) respond(['ok' => false, 'error' => 'Use a new password between 12 and 72 bytes.'], 422);
  if (!hash_equals($nextPassword, $confirm)) respond(['ok' => false, 'error' => 'The new password entries do not match.'], 422);
  if ($kind === 'admin') $settings['password_hash'] = password_hash($nextPassword, PASSWORD_DEFAULT);
  elseif ($kind === 'documents') $settings['document_password_hash'] = password_hash($nextPassword, PASSWORD_DEFAULT);
  else respond(['ok' => false, 'error' => 'Choose an admin or document password.'], 422);
  if (!$settings['password_hash'] || (empty($settings['document_password_hash']) && $kind === 'documents')) respond(['ok' => false, 'error' => 'Could not generate the password hash.'], 500);
  if (!saveSettings($settings)) respond(['ok' => false, 'error' => 'Could not update admin/config.php. Check that the host allows PHP to write that file.'], 500);
  if ($kind === 'admin') { $_SESSION['portfolio_admin_hash'] = $settings['password_hash']; $_SESSION['portfolio_admin_last_activity'] = time(); }
  if ($kind === 'documents') unset($_SESSION['documents_unlocked_hash'], $_SESSION['documents_unlocked_at']);
  respond(['ok' => true]);
}
if ($action === 'logout') { requireSameOriginPost(); $_SESSION = []; session_destroy(); respond(['ok' => true]); }
if ($action === 'save') {
  requireSameOriginPost(); requireLogin(); $body = input(); $data = $body['data'] ?? null;
  if (!is_array($data) || !isset($data['profile'], $data['contact'], $data['projects']) || !is_array($data['projects']) || count($data['projects']) > 300 || (isset($data['certificates']) && (!is_array($data['certificates']) || count($data['certificates']) > 100))) respond(['ok' => false, 'error' => 'Invalid portfolio content.'], 422);
  if (!is_dir($dataDir) && !mkdir($dataDir, 0755, true)) respond(['ok' => false, 'error' => 'Could not create data directory.'], 500);
  $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
  if ($json === false || file_put_contents($dataFile, $json, LOCK_EX) === false) respond(['ok' => false, 'error' => 'Could not write portfolio data. Check folder permissions.'], 500);
  respond(['ok' => true]);
}
if ($action === 'upload') {
  requireSameOriginPost(); requireLogin(); if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) respond(['ok' => false, 'error' => 'Upload failed.'], 422);
  $file = $_FILES['file']; if ($file['size'] > 25 * 1024 * 1024) respond(['ok' => false, 'error' => 'Maximum upload size is 25 MB.'], 422);
  $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'application/pdf' => 'pdf', 'video/mp4' => 'mp4', 'video/webm' => 'webm'];
  $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']); if (!isset($allowed[$mime])) respond(['ok' => false, 'error' => 'Use JPG, PNG, WebP, GIF, MP4, or WebM.'], 422);
  if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0755, true)) respond(['ok' => false, 'error' => 'Could not create uploads directory.'], 500);
  $name = bin2hex(random_bytes(12)) . '.' . $allowed[$mime]; if (!move_uploaded_file($file['tmp_name'], $uploadsDir . '/' . $name)) respond(['ok' => false, 'error' => 'Could not store upload.'], 500);
  respond(['ok' => true, 'url' => '/admin/uploads/' . $name]);
}
respond(['ok' => false, 'error' => 'Unknown request.'], 404);
