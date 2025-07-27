// 模擬數據
const mockData = {
    appliances: {
        ac: { name: '冷氣', power: 2.5, status: '開啟中', isOn: true },
        light: { name: '客廳燈', power: 0.3, status: '開啟中', isOn: true },
        tv: { name: '電視', power: 0.0, status: '關閉', isOn: false },
        fridge: { name: '冰箱', power: 0.8, status: '運轉中', isOn: true },
        washer: { name: '洗衣機', power: 0.0, status: '關閉', isOn: false },
        microwave: { name: '微波爐', power: 0.0, status: '關閉', isOn: false }
    },
    
    weeklyData: [
        { day: '週一', usage: 25.3, target: 30 },
        { day: '週二', usage: 28.7, target: 30 },
        { day: '週三', usage: 22.1, target: 30 },
        { day: '週四', usage: 30.2, target: 30 },
        { day: '週五', usage: 35.8, target: 30 },
        { day: '週六', usage: 42.1, target: 30 },
        { day: '週日', usage: 38.9, target: 30 }
    ],
    
    monthlyData: [
        { week: '第1週', usage: 180.5, target: 200 },
        { week: '第2週', usage: 195.2, target: 200 },
        { week: '第3週', usage: 210.8, target: 200 },
        { week: '第4週', usage: 225.3, target: 200 }
    ],
    
    hourlyData: [
        { hour: '00:00', usage: 1.2 }, { hour: '01:00', usage: 0.8 },
        { hour: '02:00', usage: 0.6 }, { hour: '03:00', usage: 0.5 },
        { hour: '04:00', usage: 0.7 }, { hour: '05:00', usage: 0.9 },
        { hour: '06:00', usage: 1.5 }, { hour: '07:00', usage: 2.8 },
        { hour: '08:00', usage: 3.2 }, { hour: '09:00', usage: 2.9 },
        { hour: '10:00', usage: 2.6 }, { hour: '11:00', usage: 3.1 },
        { hour: '12:00', usage: 4.2 }, { hour: '13:00', usage: 3.8 },
        { hour: '14:00', usage: 4.5 }, { hour: '15:00', usage: 4.8 },
        { hour: '16:00', usage: 5.2 }, { hour: '17:00', usage: 5.8 },
        { hour: '18:00', usage: 6.1 }, { hour: '19:00', usage: 7.2 },
        { hour: '20:00', usage: 7.5 }, { hour: '21:00', usage: 6.8 },
        { hour: '22:00', usage: 5.2 }, { hour: '23:00', usage: 3.1 }
    ],
    
    todayData: [
        { time: '00:00', usage: 1.2 }, { time: '04:00', usage: 0.7 },
        { time: '08:00', usage: 3.2 }, { time: '12:00', usage: 4.2 },
        { time: '16:00', usage: 5.2 }, { time: '20:00', usage: 7.5 }
    ],
    
    currentData: [
        { time: '14:00', usage: 4.5 }, { time: '14:30', usage: 4.8 },
        { time: '15:00', usage: 4.2 }, { time: '15:30', usage: 3.9 },
        { time: '16:00', usage: 5.2 }, { time: '16:30', usage: 5.8 }
    ]
};

// 全局變量
let currentPeriod = 'week';
let powerChart, todayChart, currentChart, highestChart;

// 初始化應用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    initializeApplianceControls();
    initializeTimeRange();
    initializeTodaySelect();
    initializeCharts();
    updateStatistics();
    initializeTaskControls();
    
    // 模擬實時數據更新
    setInterval(updateRealTimeData, 5000);
}

// 更新日期時間顯示
function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long'
    });
    const timeString = now.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('current-date').textContent = `${dateString}, ${timeString}`;
}

// 初始化家電控制
function initializeApplianceControls() {
    const applianceCards = document.querySelectorAll('.appliance-card');
    
    applianceCards.forEach(card => {
        const toggle = card.querySelector('.toggle-switch');
        const applianceId = card.dataset.appliance;
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleAppliance(applianceId, card);
        });
        
        card.addEventListener('click', () => {
            showApplianceDetails(applianceId);
        });
    });
}

// 切換家電狀態
function toggleAppliance(applianceId, card) {
    const appliance = mockData.appliances[applianceId];
    const toggle = card.querySelector('.toggle-switch');
    const statusElement = card.querySelector('.status');
    const powerElement = card.querySelector('.power');
    
    appliance.isOn = !appliance.isOn;
    
    if (appliance.isOn) {
        toggle.classList.add('active');
        statusElement.textContent = appliance.status;
        statusElement.classList.add('active');
        powerElement.textContent = appliance.power + ' kW';
    } else {
        toggle.classList.remove('active');
        statusElement.textContent = '關閉';
        statusElement.classList.remove('active');
        powerElement.textContent = '0.0 kW';
    }
    
    updateStatistics();
    updateCharts();
}

// 顯示家電詳情
function showApplianceDetails(applianceId) {
    const appliance = mockData.appliances[applianceId];
    const status = appliance.isOn ? appliance.status : '關閉';
    const power = appliance.isOn ? appliance.power + ' kW' : '0.0 kW';
    
    // 創建一個更美觀的彈窗
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${appliance.name} 詳情</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="detail-item">
                    <span class="label">狀態：</span>
                    <span class="value ${appliance.isOn ? 'active' : ''}">${status}</span>
                </div>
                <div class="detail-item">
                    <span class="label">功率：</span>
                    <span class="value">${power}</span>
                </div>
                <div class="detail-item">
                    <span class="label">運行時間：</span>
                    <span class="value">${appliance.isOn ? '2小時30分鐘' : '0分鐘'}</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 關閉彈窗
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 初始化時間範圍選擇
function initializeTimeRange() {
    const timeRangeSelect = document.getElementById('time-range');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', () => {
            currentPeriod = timeRangeSelect.value;
            updateCharts();
        });
    }
}

// 初始化今日選擇
function initializeTodaySelect() {
    const todaySelect = document.getElementById('today-select');
    if (todaySelect) {
        todaySelect.addEventListener('change', () => {
            updateTodayChart();
        });
    }
}

// 初始化任務控制
function initializeTaskControls() {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const checkbox = item.querySelector('.task-checkbox');
        checkbox.addEventListener('click', () => {
            item.classList.toggle('completed');
            if (item.classList.contains('completed')) {
                checkbox.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                checkbox.innerHTML = '';
            }
        });
    });
}

// 初始化圖表
function initializeCharts() {
    createPowerChart();
    createTodayChart();
    createCurrentChart();
    createHighestChart();
}

// 創建主要用電量圖表
function createPowerChart() {
    const chartData = currentPeriod === 'week' ? mockData.weeklyData : mockData.monthlyData;
    const categories = chartData.map(item => currentPeriod === 'week' ? item.day : item.week);
    const usageData = chartData.map(item => item.usage);
    const targetData = chartData.map(item => item.target);
    
    powerChart = Highcharts.chart('power-chart', {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
            }
        },
        title: {
            text: currentPeriod === 'week' ? '本週用電量活動' : '本月用電量活動',
            style: {
                color: '#1a202c',
                fontSize: '18px',
                fontWeight: '600'
            }
        },
        xAxis: {
            categories: categories,
            labels: {
                style: {
                    color: '#4a5568'
                }
            },
            lineColor: '#e2e8f0',
            tickColor: '#e2e8f0'
        },
        yAxis: {
            title: {
                text: '用電量 (kWh)',
                style: {
                    color: '#4a5568'
                }
            },
            labels: {
                style: {
                    color: '#4a5568'
                }
            },
            gridLineColor: '#e2e8f0'
        },
        legend: {
            enabled: true,
            itemStyle: {
                color: '#4a5568'
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                borderRadius: 4,
                borderWidth: 0
            }
        },
        series: [{
            name: '實際用電量',
            data: usageData,
            color: '#22c55e'
        }, {
            name: '目標用電量',
            data: targetData,
            color: '#3b82f6',
            type: 'line',
            marker: {
                enabled: true,
                radius: 4
            }
        }],
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });
}

// 創建今日用電量小圖表
function createTodayChart() {
    const categories = mockData.todayData.map(item => item.time);
    const data = mockData.todayData.map(item => item.usage);
    
    todayChart = Highcharts.chart('today-chart', {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
            height: 60,
            spacing: [0, 0, 0, 0]
        },
        title: { text: '' },
        xAxis: {
            categories: categories,
            labels: { enabled: false },
            lineWidth: 0,
            tickLength: 0
        },
        yAxis: {
            title: { text: '' },
            labels: { enabled: false },
            gridLineWidth: 0
        },
        legend: { enabled: false },
        plotOptions: {
            spline: {
                lineWidth: 2,
                color: '#22c55e',
                marker: { enabled: false }
            }
        },
        series: [{
            data: data
        }],
        credits: { enabled: false },
        exporting: { enabled: false }
    });
}

// 創建即時用電量小圖表
function createCurrentChart() {
    const categories = mockData.currentData.map(item => item.time);
    const data = mockData.currentData.map(item => item.usage);
    
    currentChart = Highcharts.chart('current-chart', {
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
            height: 60,
            spacing: [0, 0, 0, 0]
        },
        title: { text: '' },
        xAxis: {
            categories: categories,
            labels: { enabled: false },
            lineWidth: 0,
            tickLength: 0
        },
        yAxis: {
            title: { text: '' },
            labels: { enabled: false },
            gridLineWidth: 0
        },
        legend: { enabled: false },
        plotOptions: {
            spline: {
                lineWidth: 2,
                color: '#ef4444',
                marker: { enabled: false }
            }
        },
        series: [{
            data: data
        }],
        credits: { enabled: false },
        exporting: { enabled: false }
    });
}

// 創建最高耗電家電小圖表
function createHighestChart() {
    const data = [2.5, 2.3, 2.7, 2.4, 2.6, 2.5];
    
    highestChart = Highcharts.chart('highest-chart', {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            height: 60,
            spacing: [0, 0, 0, 0]
        },
        title: { text: '' },
        xAxis: {
            labels: { enabled: false },
            lineWidth: 0,
            tickLength: 0
        },
        yAxis: {
            title: { text: '' },
            labels: { enabled: false },
            gridLineWidth: 0
        },
        legend: { enabled: false },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(239, 68, 68, 0.3)'],
                        [1, 'rgba(239, 68, 68, 0.05)']
                    ]
                },
                lineWidth: 2,
                lineColor: '#ef4444'
            }
        },
        series: [{
            data: data
        }],
        credits: { enabled: false },
        exporting: { enabled: false }
    });
}

// 更新圖表
function updateCharts() {
    if (powerChart) {
        const chartData = currentPeriod === 'week' ? mockData.weeklyData : mockData.monthlyData;
        const categories = chartData.map(item => currentPeriod === 'week' ? item.day : item.week);
        const usageData = chartData.map(item => item.usage);
        const targetData = chartData.map(item => item.target);
        
        powerChart.update({
            title: {
                text: currentPeriod === 'week' ? '本週用電量活動' : '本月用電量活動'
            },
            xAxis: {
                categories: categories
            },
            series: [{
                data: usageData
            }, {
                data: targetData
            }]
        });
    }
}

// 更新今日圖表
function updateTodayChart() {
    const todaySelect = document.getElementById('today-select');
    if (todaySelect && todayChart) {
        const isToday = todaySelect.value === 'today';
        const data = isToday ? mockData.todayData : mockData.todayData.map(item => ({ ...item, usage: item.usage * 0.8 }));
        
        todayChart.series[0].setData(data.map(item => item.usage));
    }
}

// 更新統計數據
function updateStatistics() {
    const totalPower = Object.values(mockData.appliances)
        .filter(app => app.isOn)
        .reduce((sum, app) => sum + app.power, 0);
    
    const highestConsumer = Object.values(mockData.appliances)
        .filter(app => app.isOn)
        .reduce((max, app) => app.power > max.power ? app : max, { power: 0, name: '無' });
    
    const todayUsage = mockData.hourlyData.reduce((sum, hour) => sum + hour.usage, 0);
    
    document.getElementById('current-power').textContent = totalPower.toFixed(1);
    document.getElementById('highest-consumer-power').textContent = highestConsumer.power.toFixed(1);
    document.getElementById('today-usage').textContent = todayUsage.toFixed(1);
    
    // 更新最高耗電家電名稱
    const highestConsumerElement = document.querySelector('.stat-change span');
    if (highestConsumerElement && highestConsumer.name !== '無') {
        highestConsumerElement.textContent = highestConsumer.name;
    }
}

// 模擬實時數據更新
function updateRealTimeData() {
    // 隨機更新一些家電的功率
    Object.keys(mockData.appliances).forEach(applianceId => {
        const appliance = mockData.appliances[applianceId];
        if (appliance.isOn && appliance.power > 0) {
            // 添加一些隨機波動
            const variation = (Math.random() - 0.5) * 0.2;
            appliance.power = Math.max(0, appliance.power + variation);
            
            // 更新顯示
            const card = document.querySelector(`[data-appliance="${applianceId}"]`);
            if (card) {
                const powerElement = card.querySelector('.power');
                powerElement.textContent = appliance.power.toFixed(1) + ' kW';
            }
        }
    });
    
    // 更新小圖表數據
    if (currentChart) {
        const newData = mockData.currentData.map(item => ({
            ...item,
            usage: item.usage + (Math.random() - 0.5) * 0.5
        }));
        currentChart.series[0].setData(newData.map(item => item.usage));
    }
    
    updateStatistics();
}

// 添加一些動畫效果
function addAnimationEffects() {
    const cards = document.querySelectorAll('.stat-card, .appliance-card, .chart-section, .appliances-grid');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 頁面加載完成後添加動畫效果
window.addEventListener('load', addAnimationEffects);

// 添加模態框樣式
const modalStyles = `
<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    border-radius: 16px;
    padding: 0;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1a202c;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #718096;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f1f5f9;
    color: #1a202c;
}

.modal-body {
    padding: 24px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-item .label {
    font-weight: 500;
    color: #4a5568;
}

.detail-item .value {
    font-weight: 600;
    color: #1a202c;
}

.detail-item .value.active {
    color: #22c55e;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { 
        opacity: 0;
        transform: translateY(30px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`;

// 將樣式添加到頁面
document.head.insertAdjacentHTML('beforeend', modalStyles); 