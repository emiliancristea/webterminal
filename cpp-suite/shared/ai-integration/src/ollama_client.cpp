#include "ollama_client.h"
#include "xeno_ai_client.h"
#include <QTimer>

namespace XenoAI {

OllamaClient::OllamaClient(const std::string& host, int port, QObject* parent)
    : QObject(parent)
    , m_host(host)
    , m_port(port)
{
}

bool OllamaClient::isAvailable() {
    // In real implementation, check if Ollama is running on specified host:port
    return true; // Simulate availability
}

void OllamaClient::generateText(const std::string& prompt, const std::string& model,
                               std::function<void(AIResponse)> callback) {
    if (!isAvailable()) {
        AIResponse response;
        response.success = false;
        response.error = "Ollama service not available";
        callback(response);
        return;
    }

    // Simulate local LLM processing (slower than cloud)
    QTimer::singleShot(2000, [callback, model]() {
        AIResponse response;
        response.success = true;
        response.result = "Local response from " + model + " via Ollama";
        response.creditsUsed = 0; // Local models don't use credits
        callback(response);
    });
}

void OllamaClient::generateCode(const std::string& prompt, const std::string& language,
                               std::function<void(AIResponse)> callback) {
    if (!isAvailable()) {
        AIResponse response;
        response.success = false;
        response.error = "Ollama service not available";
        callback(response);
        return;
    }

    // Simulate code generation with local model
    QTimer::singleShot(3000, [callback, language]() {
        AIResponse response;
        response.success = true;
        response.result = "// Generated " + language + " code via Ollama\n"
                         "int main() {\n  printf(\"Hello from Ollama!\");\n  return 0;\n}";
        response.creditsUsed = 0;
        callback(response);
    });
}

std::vector<std::string> OllamaClient::getInstalledModels() {
    return {
        "llama2",
        "codellama",
        "mistral",
        "neural-chat"
    };
}

void OllamaClient::pullModel(const std::string& model, std::function<void(bool)> callback) {
    // Simulate model download/pull
    QTimer::singleShot(5000, [callback]() {
        callback(true); // Simulate successful pull
    });
}

} // namespace XenoAI

#include "ollama_client.moc"