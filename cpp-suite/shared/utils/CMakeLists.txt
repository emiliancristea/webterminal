cmake_minimum_required(VERSION 3.20)

# Utils shared library
add_library(utils STATIC
    src/platform_utils.cpp
)

target_include_directories(utils PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_link_libraries(utils
    Qt6::Core
)

target_compile_features(utils PUBLIC cxx_std_20)