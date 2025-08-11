#pragma once

#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <memory>

namespace XenoAI {
class XenoAIClient;
class CreditManager;
}

/**
 * @brief Widget for displaying and managing Xeno Labs credit balance
 * 
 * Integrates with Xeno Labs platform to show:
 * - Current credit balance
 * - Credit usage analytics  
 * - Purchase credits functionality
 * - Real-time balance updates
 */
class CreditWidget : public QWidget
{
    Q_OBJECT

public:
    explicit CreditWidget(QWidget *parent = nullptr);
    ~CreditWidget();

    void refreshBalance();
    void showCreditDialog();

private slots:
    void onBalanceUpdated(int newBalance);
    void onPurchaseCredits();
    void onViewAnalytics();

private:
    void setupUI();
    void updateBalanceDisplay();

    // UI Components
    QLabel* m_balanceLabel;
    QLabel* m_statusLabel;
    QPushButton* m_purchaseBtn;
    QPushButton* m_analyticsBtn;
    
    // Xeno Labs integration
    std::shared_ptr<XenoAI::XenoAIClient> m_xenoClient;
    std::shared_ptr<XenoAI::CreditManager> m_creditManager;
    
    int m_currentBalance;
};