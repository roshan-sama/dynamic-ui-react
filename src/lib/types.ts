export interface ComponentPermissions {
  data: {
    read: string[];
    write: string[];
  };
  iframe: boolean;
  events: string[];
}

export interface UIConfig {
  components: {
    id: string;
    remoteUrl: string;
    moduleName: string;
    placement: "header" | "sidebar" | "content" | "overlay";
    permissions: ComponentPermissions;
  }[];
}

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}
