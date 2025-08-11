#pragma once

#include <string>
#include <memory>
#include <functional>
#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <nlohmann/json.hpp>

namespace XenoAI {

/**
 * @brief Response structure for AI operations
 */
struct AIResponse {
    bool success = false;
    std::string result;
    std::string error;
    int creditsUsed = 0;
    std::string requestId;
};

/**
 * @brief Credit information from Xeno Labs wallet
 */
struct CreditInfo {
    int availableCredits = 0;
    int usedCredits = 0;
    std::string walletId;
    std::string lastUpdated;
};

/**
 * @brief Client for Xeno AI cloud services with credit-based usage
 * Integrates with Xeno Labs platform for authentication and credit management
 */
class XenoAIClient : public QObject {
    Q_OBJECT

public:
    explicit XenoAIClient(const std::string& apiKey, QObject* parent = nullptr);
    ~XenoAIClient() = default;

    // Authentication and wallet management
    bool authenticate(const std::string& username, const std::string& password);
    CreditInfo getCreditBalance();
    bool deductCredits(int amount, const std::string& operation);

    // AI Operations for different apps
    void generateImage(const std::string& prompt, int credits, 
                      std::function<void(AIResponse)> callback);
    void enhanceImage(const std::string& imageData, const std::string& operation,
                     int credits, std::function<void(AIResponse)> callback);
    void processVideo(const std::string& videoPath, const std::string& operation,
                     int credits, std::function<void(AIResponse)> callback);
    void enhanceAudio(const std::string& audioData, const std::string& operation,
                     int credits, std::function<void(AIResponse)> callback);
    void generateCode(const std::string& prompt, const std::string& language,
                     int credits, std::function<void(AIResponse)> callback);

    // Configuration
    void setApiEndpoint(const std::string& endpoint);
    void setUserAgent(const std::string& userAgent);

signals:
    void creditBalanceChanged(int newBalance);
    void operationCompleted(const AIResponse& response);
    void authenticationChanged(bool isAuthenticated);

private slots:
    void handleNetworkReply();

private:
    std::unique_ptr<QNetworkAccessManager> m_networkManager;
    std::string m_apiKey;
    std::string m_apiEndpoint;
    std::string m_userAgent;
    std::string m_authToken;
    CreditInfo m_creditInfo;
    bool m_isAuthenticated;

    void makeRequest(const std::string& endpoint, const nlohmann::json& payload,
                    std::function<void(AIResponse)> callback);
    AIResponse parseResponse(const QByteArray& data);
};

} // namespace XenoAI