# Monitoring Setup Guide

## 📊 Dashboard Management

### Current Dashboards
Your setup now includes these pre-configured dashboards:
- **Business Overview** (`business-overview.json`) - Application metrics, user/project/task statistics and Gen AI performance
- **JVM Performance** (`jvm-performance.json`) - JVM Performance monitoring for Spring Boot services

#### Dashboard Provisioning

Grafana automatically loads dashboards from the `./monitoring/dashboards/` directory when it starts up.
You can add new files directly there or import them from the grafana website.

### 🔧 Configuration Files

- **`prometheus.yml`**: Prometheus scraping configuration
- **`grafana.yml`**: Datasource provisioning (connects to Prometheus)
- **`grafana-dashboards.yml`**: Dashboard auto-loading configuration
- **`grafana-contact-points.yml`**: Contact points used for Alerting

### 🚨 Alerting

Alerting is set up using Discord webhooks. Currently only alerts for GenAI usage (API requests) are set.
The alert will fire if there are more than 20 genAI API requests in the last 24h.
Alerting is setup automatically for the K8S and AWS deployments. For local deployment you need to set the
Discord's webhook URL manually under `./monitoring/grafana-contact-points.yml`.

### 🎯 Access Points
- **Grafana**: `http://localhost/grafana` (admin/admin)
- **Prometheus**: `http://localhost/prometheus`
- (For K8S replace localhost with the corresponding hostname)
