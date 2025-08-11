cmake_minimum_required(VERSION 3.20)

# Launcher application
add_executable(launcher
    src/main.cpp
    src/launcher_window.cpp
    src/credit_widget.cpp
    src/app_manager.cpp
)

target_include_directories(launcher PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_link_libraries(launcher
    Qt6::Core
    Qt6::Widgets
    Qt6::Gui
    Qt6::Network
    ai-integration
    utils
)

target_compile_features(launcher PRIVATE cxx_std_20)

# Qt resource compilation
qt_standard_project_setup()

# Copy resources
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/resources 
     DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

# Platform-specific settings
if(WIN32)
    set_target_properties(launcher PROPERTIES
        WIN32_EXECUTABLE TRUE
    )
elseif(APPLE)
    set_target_properties(launcher PROPERTIES
        MACOSX_BUNDLE TRUE
    )
endif()