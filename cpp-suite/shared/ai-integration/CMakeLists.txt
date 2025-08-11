cmake_minimum_required(VERSION 3.20)

# AI Integration shared library
add_library(ai-integration STATIC
    src/xeno_ai_client.cpp
    src/openrouter_client.cpp
    src/ollama_client.cpp
    src/credit_manager.cpp
)

target_include_directories(ai-integration PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_link_libraries(ai-integration
    Qt6::Core
    Qt6::Network
    unofficial::cpp-httplib::cpp-httplib
    nlohmann_json::nlohmann_json
)

target_compile_features(ai-integration PUBLIC cxx_std_20)