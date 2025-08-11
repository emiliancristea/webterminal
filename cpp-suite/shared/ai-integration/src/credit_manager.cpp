#include "credit_manager.h"
#include <QTimer>

namespace XenoAI {

CreditManager::CreditManager(std::shared_ptr<XenoAIClient> xenoClient, QObject* parent)
    : QObject(parent)
    , m_xenoClient(xenoClient)
{
    // Connect to credit balance changes
    connect(m_xenoClient.get(), &XenoAIClient::creditBalanceChanged,
            this, [this](int newBalance) {
                m_lastKnownBalance.availableCredits = newBalance;
                emit balanceUpdated(m_lastKnownBalance);
            });
}

CreditInfo CreditManager::getCurrentBalance() {
    if (m_xenoClient) {
        m_lastKnownBalance = m_xenoClient->getCreditBalance();
    }
    return m_lastKnownBalance;
}

bool CreditManager::reserveCredits(int amount, const std::string& operation) {
    if (m_lastKnownBalance.availableCredits >= amount) {
        // In real implementation, this would reserve credits on server
        return true;
    }
    
    emit insufficientCredits(amount, m_lastKnownBalance.availableCredits);
    return false;
}

bool CreditManager::consumeCredits(int amount, const std::string& operation) {
    if (m_xenoClient) {
        return m_xenoClient->deductCredits(amount, operation);
    }
    return false;
}

void CreditManager::refreshBalance() {
    if (m_xenoClient) {
        m_lastKnownBalance = m_xenoClient->getCreditBalance();
        emit balanceUpdated(m_lastKnownBalance);
    }
}

void CreditManager::syncWithXenoLabs() {
    // Simulate synchronization with Xeno Labs wallet
    QTimer::singleShot(1000, [this]() {
        refreshBalance();
    });
}

void CreditManager::purchaseCredits(int amount) {
    // Simulate credit purchase
    QTimer::singleShot(2000, [this, amount]() {
        m_lastKnownBalance.availableCredits += amount;
        emit purchaseCompleted(true, m_lastKnownBalance.availableCredits);
        emit balanceUpdated(m_lastKnownBalance);
    });
}

int CreditManager::estimateCost(const std::string& operation, const std::string& parameters) {
    // Cost estimation based on operation type
    if (operation == "image_generation") return 5;
    if (operation == "image_enhancement") return 3;
    if (operation == "video_processing") return 10;
    if (operation == "audio_enhancement") return 2;
    if (operation == "code_generation") return 1;
    return 1; // Default cost
}

} // namespace XenoAI

#include "credit_manager.moc"