#include "platform_utils.h"
#include <QStandardPaths>
#include <QDir>
#include <QFileInfo>
#include <QSysInfo>
#include <QDesktopServices>
#include <QUrl>
#include <thread>

#ifdef Q_OS_WIN
#include <windows.h>
#elif defined(Q_OS_MACOS)
#include <sys/sysctl.h>
#elif defined(Q_OS_LINUX)
#include <sys/sysinfo.h>
#endif

namespace XenoAI {
namespace Utils {

std::string PlatformUtils::getAppDataPath() {
    return QStandardPaths::writableLocation(QStandardPaths::AppDataLocation).toStdString();
}

std::string PlatformUtils::getConfigPath() {
    return QStandardPaths::writableLocation(QStandardPaths::ConfigLocation).toStdString();
}

std::string PlatformUtils::getTempPath() {
    return QStandardPaths::writableLocation(QStandardPaths::TempLocation).toStdString();
}

std::string PlatformUtils::getUserHomePath() {
    return QStandardPaths::writableLocation(QStandardPaths::HomeLocation).toStdString();
}

bool PlatformUtils::isWindows() {
#ifdef Q_OS_WIN
    return true;
#else
    return false;
#endif
}

bool PlatformUtils::isMacOS() {
#ifdef Q_OS_MACOS
    return true;
#else
    return false;
#endif
}

bool PlatformUtils::isLinux() {
#ifdef Q_OS_LINUX
    return true;
#else
    return false;
#endif
}

std::string PlatformUtils::getPlatformName() {
    return QSysInfo::productType().toStdString();
}

std::string PlatformUtils::getSystemVersion() {
    return QSysInfo::productVersion().toStdString();
}

int PlatformUtils::getCpuCores() {
    return std::thread::hardware_concurrency();
}

size_t PlatformUtils::getAvailableMemory() {
#ifdef Q_OS_WIN
    MEMORYSTATUSEX memInfo;
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);
    GlobalMemoryStatusEx(&memInfo);
    return static_cast<size_t>(memInfo.ullAvailPhys);
#elif defined(Q_OS_LINUX)
    struct sysinfo memInfo;
    sysinfo(&memInfo);
    return static_cast<size_t>(memInfo.freeram * memInfo.mem_unit);
#else
    return 0; // Fallback for other platforms
#endif
}

void PlatformUtils::openUrl(const std::string& url) {
    QDesktopServices::openUrl(QUrl(QString::fromStdString(url)));
}

bool PlatformUtils::createDirectory(const std::string& path) {
    return QDir().mkpath(QString::fromStdString(path));
}

bool PlatformUtils::fileExists(const std::string& path) {
    return QFileInfo::exists(QString::fromStdString(path));
}

} // namespace Utils
} // namespace XenoAI