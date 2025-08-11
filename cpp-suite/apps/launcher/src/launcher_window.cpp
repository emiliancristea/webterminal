#include "launcher_window.h"
#include "credit_widget.h"
#include "app_manager.h"
#include <QApplication>
#include <QMenuBar>
#include <QToolBar>
#include <QStatusBar>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QGridLayout>
#include <QPushButton>
#include <QLabel>
#include <QProgressBar>
#include <QMessageBox>
#include <QDesktopServices>
#include <QUrl>
#include <QFont>
#include <QPixmap>
#include <QIcon>

LauncherWindow::LauncherWindow(QWidget *parent)
    : QMainWindow(parent)
    , m_centralWidget(nullptr)
    , m_appsLayout(nullptr)
    , m_creditWidget(nullptr)
    , m_appManager(nullptr)
{
    setWindowTitle("Xeno Software Suite - AI-Enhanced Creative Tools");
    setMinimumSize(800, 600);
    resize(1000, 700);
    
    // Initialize managers
    m_appManager = new AppManager(this);
    
    setupUI();
}

LauncherWindow::~LauncherWindow() = default;

void LauncherWindow::setupUI() {
    setupMenuBar();
    setupToolBar();
    setupCentralWidget();
    setupStatusBar();
}

void LauncherWindow::setupMenuBar() {
    auto* fileMenu = menuBar()->addMenu("&File");
    fileMenu->addAction("&Refresh Apps", this, &LauncherWindow::checkForUpdates);
    fileMenu->addSeparator();
    fileMenu->addAction("E&xit", this, &QWidget::close);
    
    auto* toolsMenu = menuBar()->addMenu("&Tools");
    toolsMenu->addAction("&Credits Manager", this, &LauncherWindow::showCreditsDialog);
    toolsMenu->addAction("&Open Xeno Labs", this, &LauncherWindow::openXenoLabs);
    
    auto* helpMenu = menuBar()->addMenu("&Help");
    helpMenu->addAction("&About", [this]() {
        QMessageBox::about(this, "About Xeno Software Suite",
            "Xeno Software Suite v1.0.0\n\n"
            "AI-enhanced creative and coding tools integrated with\n"
            "Xeno Labs platform for credit-based AI usage.\n\n"
            "© 2024 Xeno AI - All rights reserved");
    });
}

void LauncherWindow::setupToolBar() {
    auto* toolbar = addToolBar("Main");
    toolbar->setToolButtonStyle(Qt::ToolButtonTextBesideIcon);
    
    toolbar->addAction("Refresh", this, &LauncherWindow::checkForUpdates);
    toolbar->addSeparator();
    toolbar->addAction("Credits", this, &LauncherWindow::showCreditsDialog);
    toolbar->addAction("Xeno Labs", this, &LauncherWindow::openXenoLabs);
}

void LauncherWindow::setupCentralWidget() {
    m_centralWidget = new QWidget;
    setCentralWidget(m_centralWidget);
    
    auto* mainLayout = new QVBoxLayout(m_centralWidget);
    
    // Welcome section
    auto* titleLabel = new QLabel("Xeno Software Suite");
    titleLabel->setAlignment(Qt::AlignCenter);
    QFont titleFont = titleLabel->font();
    titleFont.setPointSize(24);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    mainLayout->addWidget(titleLabel);
    
    auto* subtitleLabel = new QLabel("AI-Enhanced Creative and Coding Tools");
    subtitleLabel->setAlignment(Qt::AlignCenter);
    QFont subtitleFont = subtitleLabel->font();
    subtitleFont.setPointSize(12);
    subtitleLabel->setFont(subtitleFont);
    subtitleLabel->setStyleSheet("color: #888;");
    mainLayout->addWidget(subtitleLabel);
    
    mainLayout->addSpacing(20);
    
    // Credit widget
    m_creditWidget = new CreditWidget(this);
    mainLayout->addWidget(m_creditWidget);
    
    mainLayout->addSpacing(20);
    
    // Apps grid
    m_appsLayout = new QGridLayout;
    m_appsLayout->setSpacing(20);
    
    // Create app buttons
    createAppButton("Image Edit", 
                   "AI-powered image editor with generative fill and object removal",
                   "", [this]() { launchImageEdit(); });
    
    createAppButton("Video Edit",
                   "Video editor with auto-editing and AI stabilization",
                   "", [this]() { launchVideoEdit(); });
    
    createAppButton("Audio Edit",
                   "Audio tool with voice cloning and noise reduction",
                   "", [this]() { launchAudioEdit(); });
    
    createAppButton("Xeno Code",
                   "AI-assisted IDE with cloud and local LLM support",
                   "", [this]() { launchXenoCode(); });
    
    mainLayout->addLayout(m_appsLayout);
    mainLayout->addStretch();
}

void LauncherWindow::setupStatusBar() {
    m_statusLabel = new QLabel("Ready");
    statusBar()->addWidget(m_statusLabel);
    
    m_progressBar = new QProgressBar;
    m_progressBar->setVisible(false);
    statusBar()->addPermanentWidget(m_progressBar);
}

void LauncherWindow::createAppButton(const QString& name, const QString& description,
                                   const QString& iconPath, std::function<void()> launchFunc) {
    auto* button = new QPushButton;
    button->setText(name);
    button->setMinimumSize(200, 120);
    button->setMaximumSize(250, 150);
    button->setToolTip(description);
    
    // Style the button
    button->setStyleSheet(
        "QPushButton {"
        "   border: 2px solid #555;"
        "   border-radius: 10px;"
        "   padding: 10px;"
        "   font-size: 14px;"
        "   font-weight: bold;"
        "   background-color: #404040;"
        "}"
        "QPushButton:hover {"
        "   background-color: #505050;"
        "   border-color: #777;"
        "}"
        "QPushButton:pressed {"
        "   background-color: #353535;"
        "}"
    );
    
    connect(button, &QPushButton::clicked, launchFunc);
    
    // Add to grid layout
    int row = m_appsLayout->count() / 2;
    int col = m_appsLayout->count() % 2;
    m_appsLayout->addWidget(button, row, col);
}

void LauncherWindow::launchImageEdit() {
    m_statusLabel->setText("Launching Image Edit...");
    m_appManager->launchApp("image-edit");
}

void LauncherWindow::launchVideoEdit() {
    m_statusLabel->setText("Launching Video Edit...");
    m_appManager->launchApp("video-edit");
}

void LauncherWindow::launchAudioEdit() {
    m_statusLabel->setText("Launching Audio Edit...");
    m_appManager->launchApp("audio-edit");
}

void LauncherWindow::launchXenoCode() {
    m_statusLabel->setText("Launching Xeno Code...");
    m_appManager->launchApp("xeno-code");
}

void LauncherWindow::openXenoLabs() {
    QDesktopServices::openUrl(QUrl("https://xeno-labs.com"));
}

void LauncherWindow::checkForUpdates() {
    m_statusLabel->setText("Checking for updates...");
    m_progressBar->setVisible(true);
    m_progressBar->setRange(0, 0); // Indeterminate progress
    
    // Simulate update check
    QTimer::singleShot(2000, [this]() {
        m_progressBar->setVisible(false);
        m_statusLabel->setText("All apps up to date");
    });
}

void LauncherWindow::showCreditsDialog() {
    m_creditWidget->showCreditDialog();
}

#include "launcher_window.moc"