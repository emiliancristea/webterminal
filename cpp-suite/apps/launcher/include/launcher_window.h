#pragma once

#include <QMainWindow>
#include <QGridLayout>
#include <QPushButton>
#include <QLabel>
#include <QProgressBar>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <memory>

// Forward declarations
class CreditWidget;
class AppManager;

/**
 * @brief Main launcher window for Xeno Software Suite
 * 
 * Provides dashboard interface with:
 * - Credit balance display and management
 * - App launching capabilities
 * - Download/update functionality
 * - Integration with Xeno Labs platform
 */
class LauncherWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit LauncherWindow(QWidget *parent = nullptr);
    ~LauncherWindow();

private slots:
    void launchImageEdit();
    void launchVideoEdit();
    void launchAudioEdit();
    void launchXenoCode();
    void openXenoLabs();
    void checkForUpdates();
    void showCreditsDialog();

private:
    void setupUI();
    void setupMenuBar();
    void setupToolBar();
    void setupCentralWidget();
    void setupStatusBar();
    
    void createAppButton(const QString& name, const QString& description, 
                        const QString& iconPath, std::function<void()> launchFunc);

    // UI Components
    QWidget* m_centralWidget;
    QGridLayout* m_appsLayout;
    CreditWidget* m_creditWidget;
    AppManager* m_appManager;
    
    // App launch buttons
    QPushButton* m_imageEditBtn;
    QPushButton* m_videoEditBtn;
    QPushButton* m_audioEditBtn;
    QPushButton* m_xenoCodeBtn;
    
    // Status and progress
    QLabel* m_statusLabel;
    QProgressBar* m_progressBar;
};

#endif // LAUNCHER_WINDOW_H