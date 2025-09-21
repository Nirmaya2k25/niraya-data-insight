import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Download, MapPin, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsData {
  summary: {
    totalSamples: number;
    safeLocations: number;
    moderateLocations: number;
    unsafeLocations: number;
  };
  indices: {
    [key: string]: {
      value: number;
      classification: "Safe" | "Moderate" | "Unsafe";
    };
  };
  locations: Array<{
    id: number;
    lat: number;
    lng: number;
    hpi: number;
    classification: "Safe" | "Moderate" | "Unsafe";
  }>;
}

interface ResultsDisplayProps {
  results: ResultsData;
  onDownload: () => void;
  onViewMap: () => void;
}

const getClassificationColor = (classification: string) => {
  switch (classification.toLowerCase()) {
    case "safe":
      return "safe";
    case "moderate":
      return "moderate";
    case "unsafe":
      return "unsafe";
    default:
      return "secondary";
  }
};

const getClassificationIcon = (classification: string) => {
  switch (classification.toLowerCase()) {
    case "safe":
      return CheckCircle;
    case "moderate":
      return AlertCircle;
    case "unsafe":
      return AlertTriangle;
    default:
      return AlertCircle;
  }
};

const ResultsDisplay = ({ results, onDownload, onViewMap }: ResultsDisplayProps) => {
  const { summary, indices } = results;
  
  const safePercentage = (summary.safeLocations / summary.totalSamples) * 100;
  const moderatePercentage = (summary.moderateLocations / summary.totalSamples) * 100;
  const unsafePercentage = (summary.unsafeLocations / summary.totalSamples) * 100;

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Summary Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analysis Results Summary</span>
            <div className="flex space-x-2">
              <Button onClick={onViewMap} variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                View on Map
              </Button>
              <Button onClick={onDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Results
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Analysis completed for {summary.totalSamples} groundwater sampling locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Safe Locations */}
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-safe">{summary.safeLocations}</div>
              <div className="text-sm text-muted-foreground">Safe Locations</div>
              <Progress value={safePercentage} className="h-2 bg-safe/20" />
              <div className="text-xs text-muted-foreground">{safePercentage.toFixed(1)}%</div>
            </div>

            {/* Moderate Risk */}
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-moderate">{summary.moderateLocations}</div>
              <div className="text-sm text-muted-foreground">Moderate Risk</div>
              <Progress value={moderatePercentage} className="h-2 bg-moderate/20" />
              <div className="text-xs text-muted-foreground">{moderatePercentage.toFixed(1)}%</div>
            </div>

            {/* Unsafe Locations */}
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-unsafe">{summary.unsafeLocations}</div>
              <div className="text-sm text-muted-foreground">Unsafe Locations</div>
              <Progress value={unsafePercentage} className="h-2 bg-unsafe/20" />
              <div className="text-xs text-muted-foreground">{unsafePercentage.toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pollution Indices */}
      <Card>
        <CardHeader>
          <CardTitle>Pollution Indices Results</CardTitle>
          <CardDescription>
            Comprehensive analysis using five different pollution assessment methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(indices).map(([key, data]) => {
              const Icon = getClassificationIcon(data.classification);
              return (
                <div
                  key={key}
                  className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">{key}</div>
                    <Icon className={cn(
                      "h-4 w-4",
                      data.classification === "Safe" ? "text-safe" :
                      data.classification === "Moderate" ? "text-moderate" :
                      "text-unsafe"
                    )} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {data.value.toFixed(1)}
                    </div>
                    <Badge 
                      className={cn(
                        "text-xs",
                        data.classification === "Safe" ? "bg-safe text-safe-foreground" :
                        data.classification === "Moderate" ? "bg-moderate text-moderate-foreground" :
                        "bg-unsafe text-unsafe-foreground"
                      )}
                    >
                      {data.classification}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onViewMap} size="lg" className="flex-1 sm:flex-none">
          <MapPin className="h-4 w-4 mr-2" />
          View Interactive Map
        </Button>
        <Button onClick={onDownload} variant="outline" size="lg" className="flex-1 sm:flex-none">
          <Download className="h-4 w-4 mr-2" />
          Download Detailed Report
        </Button>
      </div>
    </div>
  );
};

export default ResultsDisplay;