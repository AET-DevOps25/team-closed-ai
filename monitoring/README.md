# Monitoring Setup Guide

## 📊 Dashboard Management

### Current Dashboards
Your setup now includes these pre-configured dashboards:
- **Business Overview** (`business-overview.json`) - Application metrics, user/project/task statistics
- **Kubernetes Overview** (`kubernetes-overview.json`) - Kubernetes cluster monitoring

### Dashboard Provisioning

Grafana automatically loads dashboards from the `./monitoring/dashboards/` directory when it starts up. This is configured through:

## 🚀 Adding New Dashboards

### Method 1: Copy JSON Files
Simply add any `.json` dashboard file to the `monitoring/dashboards/` directory:

## 🔧 Configuration Files

- **`prometheus.yml`**: Prometheus scraping configuration
- **`grafana.yml`**: Datasource provisioning (connects to Prometheus)
- **`grafana-dashboards.yml`**: Dashboard auto-loading configuration

## 🎯 Access Points
- **Grafana**: `http://localhost/grafana` (admin/admin)
- **Prometheus**: `http://localhost/prometheus`
  (For K8S replace localhost with the corresponding hostname)
- 