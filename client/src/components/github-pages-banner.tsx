import { AlertTriangle, ExternalLink, Github } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface GitHubPagesBannerProps {
  className?: string;
}

export function GitHubPagesBanner({ className }: GitHubPagesBannerProps) {
  return (
    <Alert className={`border-amber-500/50 bg-amber-500/10 text-amber-200 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <strong>Demo Mode:</strong> You're viewing a static demo on GitHub Pages. 
          For full terminal functionality with real command execution, deploy with a backend server.
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            className="border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            onClick={() => window.open('https://github.com/emiliancristea/webterminal', '_blank')}
          >
            <Github className="h-3 w-3 mr-1" />
            View Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            onClick={() => window.open('https://github.com/emiliancristea/webterminal#deployment', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Deploy
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}