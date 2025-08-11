#include "credit_widget.h"
#include "xeno_ai_client.h"
#include "credit_manager.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QPushButton>
#include <QFont>
#include <QTimer>
#include <QMessageBox>
#include <QDialog>
#include <QDialogButtonBox>
#include <QSpinBox>

CreditWidget::CreditWidget(QWidget *parent)
    : QWidget(parent)
    , m_balanceLabel(nullptr)
    , m_statusLabel(nullptr)
    , m_purchaseBtn(nullptr)
    , m_analyticsBtn(nullptr)
    , m_currentBalance(0)
{
    // Initialize Xeno AI client with demo API key
    m_xenoClient = std::make_shared<XenoAI::XenoAIClient>("demo_api_key");
    m_creditManager = std::make_shared<XenoAI::CreditManager>(m_xenoClient);
    
    // Simulate authentication for demo
    m_xenoClient->authenticate("demo_user", "demo_password");
    
    setupUI();
    refreshBalance();
    
    // Connect credit manager signals
    connect(m_creditManager.get(), &XenoAI::CreditManager::balanceUpdated,
            this, [this](const XenoAI::CreditInfo& info) {
                onBalanceUpdated(info.availableCredits);
            });
}

CreditWidget::~CreditWidget() = default;

void CreditWidget::setupUI() {
    auto* layout = new QVBoxLayout(this);
    
    // Credit balance section
    auto* balanceLayout = new QHBoxLayout;
    
    auto* titleLabel = new QLabel("Xeno Labs Credits:");
    QFont titleFont = titleLabel->font();
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    balanceLayout->addWidget(titleLabel);
    
    m_balanceLabel = new QLabel("0");
    QFont balanceFont = m_balanceLabel->font();
    balanceFont.setPointSize(16);
    balanceFont.setBold(true);
    m_balanceLabel->setFont(balanceFont);
    m_balanceLabel->setStyleSheet("color: #4CAF50;"); // Green for credits
    balanceLayout->addWidget(m_balanceLabel);
    
    balanceLayout->addStretch();
    
    // Action buttons
    m_purchaseBtn = new QPushButton("Purchase Credits");
    m_purchaseBtn->setStyleSheet(
        "QPushButton {"
        "   background-color: #2196F3;"
        "   border: none;"
        "   padding: 8px 16px;"
        "   border-radius: 4px;"
        "   font-weight: bold;"
        "}"
        "QPushButton:hover {"
        "   background-color: #1976D2;"
        "}"
    );
    connect(m_purchaseBtn, &QPushButton::clicked, this, &CreditWidget::onPurchaseCredits);
    balanceLayout->addWidget(m_purchaseBtn);
    
    m_analyticsBtn = new QPushButton("View Analytics");
    m_analyticsBtn->setStyleSheet(
        "QPushButton {"
        "   background-color: #9C27B0;"
        "   border: none;"
        "   padding: 8px 16px;"
        "   border-radius: 4px;"
        "   font-weight: bold;"
        "}"
        "QPushButton:hover {"
        "   background-color: #7B1FA2;"
        "}"
    );
    connect(m_analyticsBtn, &QPushButton::clicked, this, &CreditWidget::onViewAnalytics);
    balanceLayout->addWidget(m_analyticsBtn);
    
    layout->addLayout(balanceLayout);
    
    // Status label
    m_statusLabel = new QLabel("Connected to Xeno Labs");
    m_statusLabel->setStyleSheet("color: #888; font-style: italic;");
    layout->addWidget(m_statusLabel);
    
    // Style the widget
    setStyleSheet(
        "CreditWidget {"
        "   background-color: #2A2A2A;"
        "   border: 1px solid #555;"
        "   border-radius: 8px;"
        "   padding: 10px;"
        "}"
    );
}

void CreditWidget::refreshBalance() {
    if (m_creditManager) {
        auto creditInfo = m_creditManager->getCurrentBalance();
        onBalanceUpdated(creditInfo.availableCredits);
    }
}

void CreditWidget::onBalanceUpdated(int newBalance) {
    m_currentBalance = newBalance;
    updateBalanceDisplay();
}

void CreditWidget::updateBalanceDisplay() {
    m_balanceLabel->setText(QString::number(m_currentBalance));
    
    // Update color based on balance
    if (m_currentBalance > 100) {
        m_balanceLabel->setStyleSheet("color: #4CAF50;"); // Green
    } else if (m_currentBalance > 20) {
        m_balanceLabel->setStyleSheet("color: #FF9800;"); // Orange
    } else {
        m_balanceLabel->setStyleSheet("color: #F44336;"); // Red
    }
    
    m_statusLabel->setText(QString("Last updated: %1")
                          .arg(QDateTime::currentDateTime().toString("hh:mm:ss")));
}

void CreditWidget::onPurchaseCredits() {
    QDialog dialog(this);
    dialog.setWindowTitle("Purchase Credits");
    dialog.setModal(true);
    
    auto* layout = new QVBoxLayout(&dialog);
    
    layout->addWidget(new QLabel("Select credit bundle:"));
    
    auto* creditSpinBox = new QSpinBox;
    creditSpinBox->setRange(10, 10000);
    creditSpinBox->setValue(100);
    creditSpinBox->setSuffix(" credits");
    layout->addWidget(creditSpinBox);
    
    auto* priceLabel = new QLabel("Price: $10.00 USD");
    layout->addWidget(priceLabel);
    
    auto* buttonBox = new QDialogButtonBox(QDialogButtonBox::Ok | QDialogButtonBox::Cancel);
    connect(buttonBox, &QDialogButtonBox::accepted, &dialog, &QDialog::accept);
    connect(buttonBox, &QDialogButtonBox::rejected, &dialog, &QDialog::reject);
    layout->addWidget(buttonBox);
    
    if (dialog.exec() == QDialog::Accepted) {
        int credits = creditSpinBox->value();
        m_creditManager->purchaseCredits(credits);
        
        QMessageBox::information(this, "Purchase Successful",
                               QString("Successfully purchased %1 credits!\n"
                                      "Your new balance will be updated shortly.")
                               .arg(credits));
    }
}

void CreditWidget::onViewAnalytics() {
    showCreditDialog();
}

void CreditWidget::showCreditDialog() {
    QDialog dialog(this);
    dialog.setWindowTitle("Credit Analytics");
    dialog.setModal(true);
    dialog.resize(400, 300);
    
    auto* layout = new QVBoxLayout(&dialog);
    
    layout->addWidget(new QLabel("<h3>Credit Usage Analytics</h3>"));
    layout->addWidget(new QLabel(QString("Current Balance: %1 credits").arg(m_currentBalance)));
    layout->addWidget(new QLabel("Credits Used Today: 15"));
    layout->addWidget(new QLabel("Credits Used This Week: 87"));
    layout->addWidget(new QLabel("Credits Used This Month: 342"));
    
    layout->addWidget(new QLabel("<h4>Usage by Application:</h4>"));
    layout->addWidget(new QLabel("• Image Edit: 45% (154 credits)"));
    layout->addWidget(new QLabel("• Video Edit: 30% (103 credits)"));
    layout->addWidget(new QLabel("• Audio Edit: 15% (51 credits)"));
    layout->addWidget(new QLabel("• Xeno Code: 10% (34 credits)"));
    
    auto* buttonBox = new QDialogButtonBox(QDialogButtonBox::Close);
    connect(buttonBox, &QDialogButtonBox::rejected, &dialog, &QDialog::reject);
    layout->addWidget(buttonBox);
    
    dialog.exec();
}

#include "credit_widget.moc"