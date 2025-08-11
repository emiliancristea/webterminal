#include "app_manager.h"
#include <QProcess>
#include <QStandardPaths>
#include <QDir>
#include <QFileInfo>
#include <QCoreApplication>
#include <QTimer>
#include <QDebug>

AppManager::AppManager(QObject *parent)
    : QObject(parent)
{
    setupAppPaths();
}

AppManager::~AppManager() {
    // Clean up running processes
    for (auto* process : m_runningProcesses) {
        if (process && process->state() != QProcess::NotRunning) {
            process->terminate();
            if (!process->waitForFinished(3000)) {
                process->kill();
            }
        }
    }
}

void AppManager::setupAppPaths() {
    // Get application directory
    QString appDir = QCoreApplication::applicationDirPath();
    
#ifdef Q_OS_WIN
    QString extension = ".exe";
#else
    QString extension = "";
#endif

    // Map app names to executable paths
    m_appPaths["image-edit"] = appDir + "/image-edit" + extension;
    m_appPaths["video-edit"] = appDir + "/video-edit" + extension;
    m_appPaths["audio-edit"] = appDir + "/audio-edit" + extension;
    m_appPaths["xeno-code"] = appDir + "/xeno-code" + extension;
    
    // Initialize app versions (would normally read from app metadata)
    m_appVersions["image-edit"] = "1.0.0";
    m_appVersions["video-edit"] = "1.0.0";
    m_appVersions["audio-edit"] = "1.0.0";
    m_appVersions["xeno-code"] = "1.0.0";
}

bool AppManager::launchApp(const QString& appName) {
    if (m_runningProcesses.contains(appName)) {
        QProcess* process = m_runningProcesses[appName];
        if (process && process->state() != QProcess::NotRunning) {
            qDebug() << "App" << appName << "is already running";
            return true;
        }
    }
    
    QString executablePath = getAppExecutablePath(appName);
    if (executablePath.isEmpty()) {
        qWarning() << "App" << appName << "not found";
        return false;
    }
    
    QProcess* process = new QProcess(this);
    connect(process, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            this, &AppManager::onProcessFinished);
    connect(process, &QProcess::errorOccurred,
            this, &AppManager::onProcessError);
    
    process->setProperty("appName", appName);
    m_runningProcesses[appName] = process;
    
    // Launch the application
    qDebug() << "Launching" << appName << "from" << executablePath;
    process->start(executablePath);
    
    if (process->waitForStarted(5000)) {
        emit appLaunched(appName, process->processId());
        return true;
    } else {
        qWarning() << "Failed to start" << appName << ":" << process->errorString();
        m_runningProcesses.remove(appName);
        process->deleteLater();
        return false;
    }
}

bool AppManager::isAppInstalled(const QString& appName) {
    QString executablePath = getAppExecutablePath(appName);
    return !executablePath.isEmpty() && QFileInfo::exists(executablePath);
}

QString AppManager::getAppVersion(const QString& appName) {
    return m_appVersions.value(appName, "Unknown");
}

QString AppManager::getAppExecutablePath(const QString& appName) {
    QString path = m_appPaths.value(appName);
    if (path.isEmpty() || !QFileInfo::exists(path)) {
        // If app not found in build directory, simulate that it's not installed
        qDebug() << "App executable not found:" << path;
        return QString();
    }
    return path;
}

void AppManager::checkForUpdates() {
    // Simulate checking for updates
    QTimer::singleShot(1000, [this]() {
        // Simulate finding updates for some apps
        emit updateAvailable("image-edit", "1.0.1");
        emit updateAvailable("xeno-code", "1.1.0");
    });
}

void AppManager::updateApp(const QString& appName) {
    // Simulate app update process
    QTimer* timer = new QTimer(this);
    int progress = 0;
    
    connect(timer, &QTimer::timeout, [this, timer, &progress, appName]() {
        progress += 10;
        emit installationProgress(appName, progress);
        
        if (progress >= 100) {
            timer->stop();
            timer->deleteLater();
            
            // Update version
            if (appName == "image-edit") {
                m_appVersions[appName] = "1.0.1";
            } else if (appName == "xeno-code") {
                m_appVersions[appName] = "1.1.0";
            }
        }
    });
    
    timer->start(200); // Update progress every 200ms
}

void AppManager::updateAllApps() {
    for (const QString& appName : m_appPaths.keys()) {
        updateApp(appName);
    }
}

void AppManager::installApp(const QString& appName) {
    // Simulate app installation
    QTimer* timer = new QTimer(this);
    int progress = 0;
    
    connect(timer, &QTimer::timeout, [this, timer, &progress, appName]() {
        progress += 5;
        emit installationProgress(appName, progress);
        
        if (progress >= 100) {
            timer->stop();
            timer->deleteLater();
            m_appVersions[appName] = "1.0.0";
        }
    });
    
    timer->start(300); // Slower for installation
}

void AppManager::uninstallApp(const QString& appName) {
    // Stop the app if it's running
    if (m_runningProcesses.contains(appName)) {
        QProcess* process = m_runningProcesses[appName];
        if (process && process->state() != QProcess::NotRunning) {
            process->terminate();
            process->waitForFinished(3000);
        }
        m_runningProcesses.remove(appName);
    }
    
    // Remove from versions (simulate uninstall)
    m_appVersions.remove(appName);
}

void AppManager::onProcessFinished(int exitCode, QProcess::ExitStatus exitStatus) {
    QProcess* process = qobject_cast<QProcess*>(sender());
    if (!process) return;
    
    QString appName = process->property("appName").toString();
    qDebug() << "App" << appName << "finished with exit code" << exitCode;
    
    m_runningProcesses.remove(appName);
    emit appFinished(appName, exitCode);
    
    process->deleteLater();
}

void AppManager::onProcessError(QProcess::ProcessError error) {
    QProcess* process = qobject_cast<QProcess*>(sender());
    if (!process) return;
    
    QString appName = process->property("appName").toString();
    qWarning() << "App" << appName << "error:" << error << process->errorString();
    
    m_runningProcesses.remove(appName);
    process->deleteLater();
}

#include "app_manager.moc"