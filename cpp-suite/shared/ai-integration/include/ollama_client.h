#pragma once

#include <string>
#include <functional>
#include <QObject>

namespace XenoAI {

struct AIResponse; // Forward declaration

/**
 * @brief Client for local Ollama LLM integration
 * Provides offline AI capabilities via local models
 */
class OllamaClient : public QObject {
    Q_OBJECT

public:
    explicit OllamaClient(const std::string& host = "localhost", int port = 11434, QObject* parent = nullptr);
    
    bool isAvailable();
    void generateText(const std::string& prompt, const std::string& model,
                     std::function<void(AIResponse)> callback);
    void generateCode(const std::string& prompt, const std::string& language,
                     std::function<void(AIResponse)> callback);
    
    std::vector<std::string> getInstalledModels();
    void pullModel(const std::string& model, std::function<void(bool)> callback);

private:
    std::string m_host;
    int m_port;
};

} // namespace XenoAI