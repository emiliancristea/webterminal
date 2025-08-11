#pragma once

#include <QObject>
#include <QProcess>
#include <QString>
#include <QMap>

/**
 * @brief Manages launching and updating Xeno Software Suite applications
 * 
 * Handles:
 * - Launching individual apps via QProcess
 * - App installation and updates
 * - Version management
 * - Integration with app download/update system
 */
class AppManager : public QObject
{
    Q_OBJECT

public:
    explicit AppManager(QObject *parent = nullptr);
    ~AppManager();

    // App management
    bool launchApp(const QString& appName);
    bool isAppInstalled(const QString& appName);
    QString getAppVersion(const QString& appName);
    
    // Update management
    void checkForUpdates();
    void updateApp(const QString& appName);
    void updateAllApps();
    
    // Installation
    void installApp(const QString& appName);
    void uninstallApp(const QString& appName);

signals:
    void appLaunched(const QString& appName, qint64 processId);
    void appFinished(const QString& appName, int exitCode);
    void updateAvailable(const QString& appName, const QString& newVersion);
    void installationProgress(const QString& appName, int progress);

private slots:
    void onProcessFinished(int exitCode, QProcess::ExitStatus exitStatus);
    void onProcessError(QProcess::ProcessError error);

private:
    QString getAppExecutablePath(const QString& appName);
    void setupAppPaths();

    QMap<QString, QString> m_appPaths;
    QMap<QString, QProcess*> m_runningProcesses;
    QMap<QString, QString> m_appVersions;
};