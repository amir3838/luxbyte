/**
 * LUXBYTE Dashboard Interactive Features
 * ميزات التفاعل في لوحات التحكم
 */

class DashboardInteractive {
    constructor() {
        this.charts = new Map();
        this.animations = new Map();
        this.init();
    }

    /**
     * Initialize interactive features
     * تهيئة الميزات التفاعلية
     */
    init() {
        this.setupCharts();
        this.setupAnimations();
        this.setupTooltips();
        this.setupDragDrop();
        console.log('🎯 Dashboard interactive features initialized');
    }

    /**
     * Setup charts
     * إعداد الرسوم البيانية
     */
    setupCharts() {
        // Chart.js configuration
        Chart.defaults.font.family = 'Cairo, Arial, sans-serif';
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#666';

        // Register chart types
        this.registerChartTypes();
    }

    /**
     * Register custom chart types
     * تسجيل أنواع الرسوم البيانية المخصصة
     */
    registerChartTypes() {
        // Custom doughnut chart for KPIs
        Chart.register({
            id: 'luxbyte-doughnut',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const centerX = chart.width / 2;
                const centerY = chart.height / 2;

                // Draw center text
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = 'bold 16px Cairo';
                ctx.fillStyle = '#2c3e50';
                ctx.fillText('المؤشرات', centerX, centerY - 10);
                ctx.restore();
            }
        });
    }

    /**
     * Create chart
     * إنشاء رسم بياني
     */
    createChart(canvasId, type, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                ...options
            }
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Update chart data
     * تحديث بيانات الرسم البياني
     */
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }

    /**
     * Setup animations
     * إعداد الرسوم المتحركة
     */
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Setup tooltips
     * إعداد التلميحات
     */
    setupTooltips() {
        // Initialize tooltips for all elements with data-tooltip
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip);
            element.addEventListener('mouseleave', this.hideTooltip);
        });
    }

    /**
     * Show tooltip
     * إظهار التلميحة
     */
    showTooltip(event) {
        const text = event.target.getAttribute('data-tooltip');
        if (!text) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = text;
        tooltip.id = 'tooltip-' + Date.now();

        document.body.appendChild(tooltip);

        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        // Store reference for cleanup
        event.target._tooltip = tooltip;
    }

    /**
     * Hide tooltip
     * إخفاء التلميحة
     */
    hideTooltip(event) {
        if (event.target._tooltip) {
            event.target._tooltip.remove();
            delete event.target._tooltip;
        }
    }

    /**
     * Setup drag and drop
     * إعداد السحب والإفلات
     */
    setupDragDrop() {
        // Make dashboard cards draggable
        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.draggable = true;
            card.addEventListener('dragstart', this.handleDragStart);
            card.addEventListener('dragend', this.handleDragEnd);
        });

        // Setup drop zones
        document.querySelectorAll('.dashboard-grid').forEach(grid => {
            grid.addEventListener('dragover', this.handleDragOver);
            grid.addEventListener('drop', this.handleDrop);
        });
    }

    /**
     * Handle drag start
     * التعامل مع بداية السحب
     */
    handleDragStart(event) {
        event.target.classList.add('dragging');
        event.dataTransfer.setData('text/plain', event.target.id);
    }

    /**
     * Handle drag end
     * التعامل مع نهاية السحب
     */
    handleDragEnd(event) {
        event.target.classList.remove('dragging');
    }

    /**
     * Handle drag over
     * التعامل مع السحب فوق العنصر
     */
    handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
    }

    /**
     * Handle drop
     * التعامل مع الإفلات
     */
    handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');

        const cardId = event.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);

        if (card && event.target.classList.contains('dashboard-grid')) {
            event.target.appendChild(card);
            this.saveLayout();
        }
    }

    /**
     * Save dashboard layout
     * حفظ تخطيط لوحة التحكم
     */
    saveLayout() {
        const layout = Array.from(document.querySelectorAll('.dashboard-card')).map(card => ({
            id: card.id,
            order: Array.from(card.parentNode.children).indexOf(card)
        }));

        localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    }

    /**
     * Load dashboard layout
     * تحميل تخطيط لوحة التحكم
     */
    loadLayout() {
        const savedLayout = localStorage.getItem('dashboard-layout');
        if (!savedLayout) return;

        try {
            const layout = JSON.parse(savedLayout);
            layout.forEach(item => {
                const card = document.getElementById(item.id);
                if (card) {
                    card.parentNode.insertBefore(card, card.parentNode.children[item.order]);
                }
            });
        } catch (error) {
            console.warn('Failed to load dashboard layout:', error);
        }
    }

    /**
     * Reset layout
     * إعادة تعيين التخطيط
     */
    resetLayout() {
        localStorage.removeItem('dashboard-layout');
        location.reload();
    }

    /**
     * Export dashboard data
     * تصدير بيانات لوحة التحكم
     */
    exportData(format = 'json') {
        const data = {
            timestamp: new Date().toISOString(),
            charts: Array.from(this.charts.entries()).map(([id, chart]) => ({
                id: id,
                data: chart.data
            })),
            layout: Array.from(document.querySelectorAll('.dashboard-card')).map(card => ({
                id: card.id,
                title: card.querySelector('.card-title')?.textContent || '',
                order: Array.from(card.parentNode.children).indexOf(card)
            }))
        };

        if (format === 'json') {
            this.downloadFile(JSON.stringify(data, null, 2), 'dashboard-data.json', 'application/json');
        } else if (format === 'csv') {
            // Convert to CSV format
            const csv = this.convertToCSV(data);
            this.downloadFile(csv, 'dashboard-data.csv', 'text/csv');
        }
    }

    /**
     * Convert data to CSV
     * تحويل البيانات إلى CSV
     */
    convertToCSV(data) {
        const rows = [];
        rows.push(['Timestamp', 'Chart ID', 'Chart Type', 'Data']);

        data.charts.forEach(chart => {
            rows.push([
                data.timestamp,
                chart.id,
                chart.data.type || 'unknown',
                JSON.stringify(chart.data)
            ]);
        });

        return rows.map(row => row.join(',')).join('\n');
    }

    /**
     * Download file
     * تحميل ملف
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardInteractive = new DashboardInteractive();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardInteractive;
}
