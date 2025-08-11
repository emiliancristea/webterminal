cmake_minimum_required(VERSION 3.20)

# Set project name and version
project(XenoSoftwareSuite 
    VERSION 1.0.0 
    DESCRIPTION "AI-enhanced creative and coding tools integrated with Xeno Labs platform"
    LANGUAGES CXX
)

# Set C++20 standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Enable testing
enable_testing()

# Find required packages via vcpkg
find_package(Qt6 REQUIRED COMPONENTS Core Widgets Gui Network)
find_package(OpenCV REQUIRED)
find_package(PkgConfig REQUIRED)
find_package(unofficial-cpp-httplib CONFIG REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)

# Optional packages
find_package(PkgConfig QUIET)
if(PkgConfig_FOUND)
    pkg_check_modules(FFMPEG QUIET libavcodec libavformat libavutil libswscale)
    pkg_check_modules(PORTAUDIO QUIET portaudio-2.0)
    pkg_check_modules(SNDFILE QUIET sndfile)
endif()

# Add shared libraries first
add_subdirectory(shared)

# Add applications
add_subdirectory(apps)

# Add tests
find_package(GTest CONFIG QUIET)
if(GTest_FOUND)
    add_subdirectory(tests)
else()
    message(WARNING "Google Test not found. Tests will be skipped.")
endif()

# Installation
install(TARGETS launcher image-edit video-edit audio-edit xeno-code
    BUNDLE DESTINATION .
    RUNTIME DESTINATION bin
)

# Platform-specific configurations
if(WIN32)
    # Windows-specific settings
    set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT launcher)
elseif(APPLE)
    # macOS-specific settings
    set_target_properties(launcher PROPERTIES
        MACOSX_BUNDLE TRUE
        MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/resources/Info.plist.in
    )
endif()

# Configure Qt deployment
if(Qt6_FOUND)
    qt_standard_project_setup()
endif()