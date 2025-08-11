#pragma once

#include <string>
#include <functional>
#include <QObject>

namespace XenoAI {

struct AIResponse; // Forward declaration

/**
 * @brief Client for Open Router API integration
 * Provides access to third-party AI models via API keys
 */
class OpenRouterClient : public QObject {
    Q_OBJECT

public:
    explicit OpenRouterClient(const std::string& apiKey, QObject* parent = nullptr);
    
    void generateText(const std::string& prompt, const std::string& model,
                     std::function<void(AIResponse)> callback);
    void generateCode(const std::string& prompt, const std::string& language,
                     std::function<void(AIResponse)> callback);
    
    void setApiKey(const std::string& apiKey);
    std::vector<std::string> getAvailableModels();

private:
    std::string m_apiKey;
    std::string m_apiEndpoint;
};

} // namespace XenoAI