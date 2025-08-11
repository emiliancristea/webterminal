#pragma once

#include "xeno_ai_client.h"
#include <memory>

namespace XenoAI {

/**
 * @brief Manages credit operations and wallet synchronization with Xeno Labs
 */
class CreditManager : public QObject {
    Q_OBJECT

public:
    explicit CreditManager(std::shared_ptr<XenoAIClient> xenoClient, QObject* parent = nullptr);
    
    // Credit operations
    CreditInfo getCurrentBalance();
    bool reserveCredits(int amount, const std::string& operation);
    bool consumeCredits(int amount, const std::string& operation);
    void refreshBalance();
    
    // Wallet synchronization
    void syncWithXenoLabs();
    void purchaseCredits(int amount);
    
    // Cost estimation
    int estimateCost(const std::string& operation, const std::string& parameters = "");

signals:
    void balanceUpdated(const CreditInfo& info);
    void insufficientCredits(int required, int available);
    void purchaseCompleted(bool success, int newBalance);

private:
    std::shared_ptr<XenoAIClient> m_xenoClient;
    CreditInfo m_lastKnownBalance;
};

} // namespace XenoAI