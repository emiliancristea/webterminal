#include <QApplication>
#include <QStyleFactory>
#include <QDir>
#include "launcher_window.h"

/**
 * @brief Main entry point for Xeno Software Suite Launcher
 * 
 * The launcher provides a central hub for:
 * - Downloading and updating Xeno AI apps
 * - Managing credit balance from Xeno Labs
 * - Launching individual tools (Image Edit, Video Edit, Audio Edit, Xeno Code)
 * - Integrating with Xeno Labs API for authentication and wallet management
 */
int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    
    // Set application metadata for Xeno Labs integration
    QCoreApplication::setOrganizationName("Xeno AI");
    QCoreApplication::setOrganizationDomain("xeno-labs.com");
    QCoreApplication::setApplicationName("Xeno Software Suite Launcher");
    QCoreApplication::setApplicationVersion("1.0.0");
    
    // Set modern application style
    QApplication::setStyle(QStyleFactory::create("Fusion"));
    
    // Apply dark theme palette for professional look
    QPalette darkPalette;
    darkPalette.setColor(QPalette::Window, QColor(53, 53, 53));
    darkPalette.setColor(QPalette::WindowText, Qt::white);
    darkPalette.setColor(QPalette::Base, QColor(25, 25, 25));
    darkPalette.setColor(QPalette::AlternateBase, QColor(53, 53, 53));
    darkPalette.setColor(QPalette::ToolTipBase, Qt::white);
    darkPalette.setColor(QPalette::ToolTipText, Qt::white);
    darkPalette.setColor(QPalette::Text, Qt::white);
    darkPalette.setColor(QPalette::Button, QColor(53, 53, 53));
    darkPalette.setColor(QPalette::ButtonText, Qt::white);
    darkPalette.setColor(QPalette::BrightText, Qt::red);
    darkPalette.setColor(QPalette::Link, QColor(42, 130, 218));
    darkPalette.setColor(QPalette::Highlight, QColor(42, 130, 218));
    darkPalette.setColor(QPalette::HighlightedText, Qt::black);
    app.setPalette(darkPalette);
    
    // Create and show launcher window
    LauncherWindow window;
    window.show();
    
    return app.exec();
}