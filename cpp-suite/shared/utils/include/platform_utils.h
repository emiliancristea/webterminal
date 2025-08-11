#pragma once

#include <string>
#include <QStandardPaths>

namespace XenoAI {
namespace Utils {

/**
 * @brief Platform-specific utilities for cross-platform compatibility
 */
class PlatformUtils {
public:
    // File system utilities
    static std::string getAppDataPath();
    static std::string getConfigPath();
    static std::string getTempPath();
    static std::string getUserHomePath();
    
    // Platform detection
    static bool isWindows();
    static bool isMacOS();
    static bool isLinux();
    
    // System information
    static std::string getPlatformName();
    static std::string getSystemVersion();
    static int getCpuCores();
    static size_t getAvailableMemory();
    
    // Application utilities
    static void openUrl(const std::string& url);
    static bool createDirectory(const std::string& path);
    static bool fileExists(const std::string& path);
};

} // namespace Utils
} // namespace XenoAI