#include "openrouter_client.h"
#include "xeno_ai_client.h"
#include <QTimer>

namespace XenoAI {

OpenRouterClient::OpenRouterClient(const std::string& apiKey, QObject* parent)
    : QObject(parent)
    , m_apiKey(apiKey)
    , m_apiEndpoint("https://openrouter.ai/api/v1")
{
}

void OpenRouterClient::generateText(const std::string& prompt, const std::string& model,
                                   std::function<void(AIResponse)> callback) {
    // Simulate Open Router API call
    QTimer::singleShot(300, [callback]() {
        AIResponse response;
        response.success = true;
        response.result = "Generated text via Open Router API";
        response.creditsUsed = 0; // Open Router uses own pricing
        callback(response);
    });
}

void OpenRouterClient::generateCode(const std::string& prompt, const std::string& language,
                                   std::function<void(AIResponse)> callback) {
    // Simulate code generation via Open Router
    QTimer::singleShot(400, [callback, language]() {
        AIResponse response;
        response.success = true;
        response.result = "// Generated " + language + " code via Open Router\n"
                         "function example() {\n  return 'Hello World';\n}";
        response.creditsUsed = 0;
        callback(response);
    });
}

void OpenRouterClient::setApiKey(const std::string& apiKey) {
    m_apiKey = apiKey;
}

std::vector<std::string> OpenRouterClient::getAvailableModels() {
    return {
        "anthropic/claude-3-opus",
        "openai/gpt-4",
        "openai/gpt-3.5-turbo",
        "meta-llama/llama-2-70b-chat"
    };
}

} // namespace XenoAI

#include "openrouter_client.moc"