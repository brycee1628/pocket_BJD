<template>
    <div class="detail-container">
        <div class="back-link">
            <router-link to="/" class="back-button">← 返回列表</router-link>
        </div>

        <!-- 加載指示器 -->
        <div class="loading" v-if="isLoading">
            <div class="spinner"></div>
            <p>加載中...</p>
        </div>

        <!-- 數據不存在提示 -->
        <div class="empty-state" v-else-if="!doll">
            <p>找不到該娃娃資料。可能已被刪除或連結錯誤。</p>
            <router-link to="/" class="back-link">返回首頁</router-link>
        </div>

        <div class="detail-content" v-else>
            <div class="detail-header">
                <h1 class="detail-title">{{ doll.name }}</h1>
                <span class="tag" :class="doll.tagType">{{ doll.tag }}</span>
            </div>

            <div class="detail-body">
                <div class="detail-image-container">
                    <img :src="doll.imageUrl" alt="娃娃圖片" @error="handleImageError" class="detail-image">
                </div>

                <div class="detail-info">
                    <div class="detail-section">
                        <h2>基本資訊</h2>
                        <table class="info-table">
                            <tr>
                                <td class="label">製作者:</td>
                                <td class="value">{{ doll.brand || '未填寫' }}</td>
                            </tr>
                            <tr>
                                <td class="label">價格:</td>
                                <td class="value">{{ formatCurrency(doll) }}</td>
                            </tr>
                            <tr>
                                <td class="label">產地:</td>
                                <td class="value">{{ doll.location || '未填寫' }}</td>
                            </tr>
                            <tr v-if="doll.size">
                                <td class="label">尺寸:</td>
                                <td class="value">{{ doll.size }}</td>
                            </tr>
                            <tr v-if="doll.color">
                                <td class="label">顏色:</td>
                                <td class="value">{{ doll.color }}</td>
                            </tr>
                            <tr v-if="doll.purchaseDate">
                                <td class="label">入手日期:</td>
                                <td class="value">{{ formatPurchaseDate(doll.purchaseDate) }}</td>
                            </tr>
                            <tr v-if="doll.createdAt">
                                <td class="label">加入時間:</td>
                                <td class="value">{{ formatDate(doll.createdAt) }}</td>
                            </tr>
                            <tr v-if="doll.updatedAt">
                                <td class="label">最後更新:</td>
                                <td class="value">{{ formatDate(doll.updatedAt) }}</td>
                            </tr>
                        </table>
                    </div>

                    <div v-if="doll.notes" class="detail-section">
                        <h2>備註</h2>
                        <div class="notes-content">{{ doll.notes }}</div>
                    </div>

                    <div v-if="doll.link" class="detail-section">
                        <h2>購買連結</h2>
                        <a :href="doll.link" target="_blank" class="purchase-link">{{ doll.link }}</a>
                    </div>

                    <div class="detail-actions">
                        <button class="edit-button" @click="editDoll">編輯</button>
                        <button class="delete-button" @click="deleteDoll">刪除</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 密碼驗證彈窗 -->
        <PasswordModal :visible="showPasswordModal" :title="passwordModalConfig.title"
            :message="passwordModalConfig.message" @success="onPasswordSuccess" @cancel="onPasswordCancel" />

        <!-- 自定義警告彈窗 -->
        <AlertModal :visible="alertModal.show" :title="alertModal.title" :message="alertModal.message"
            @close="closeAlertModal" />

        <!-- 自定義確認彈窗 -->
        <ConfirmModal :visible="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message"
            @confirm="confirmAction" @cancel="cancelAction" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { database, ref as dbRef, get, remove } from '../firebase';
import { isValidAuth } from '../auth';
import PasswordModal from '../components/PasswordModal.vue';
import AlertModal from '../components/AlertModal.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const router = useRouter();
const route = useRoute();
const doll = ref(null);
const isLoading = ref(true);
const showPasswordModal = ref(false);
const passwordModalConfig = reactive({
    title: '驗證密碼',
    message: '請輸入管理密碼以繼續操作',
    actionType: '' // 'edit', 'delete'
});

// 警告彈窗狀態
const alertModal = reactive({
    show: false,
    title: '提示',
    message: '',
    callback: null
});

// 確認彈窗狀態
const confirmModal = reactive({
    show: false,
    title: '確認',
    message: '',
    action: null
});

// 修復formattedDate未定義的問題
const formattedDate = ref('');

// 顯示警告彈窗
const showAlert = (message, title = '提示', callback = null) => {
    alertModal.title = title;
    alertModal.message = message;
    alertModal.callback = callback;
    alertModal.show = true;
};

// 關閉警告彈窗
const closeAlertModal = () => {
    alertModal.show = false;
    if (alertModal.callback) {
        alertModal.callback();
        alertModal.callback = null;
    }
};

// 顯示確認彈窗
const showConfirm = (message, action, title = '確認') => {
    confirmModal.title = title;
    confirmModal.message = message;
    confirmModal.action = action;
    confirmModal.show = true;
};

// 確認操作
const confirmAction = () => {
    confirmModal.show = false;
    if (confirmModal.action) {
        confirmModal.action();
        confirmModal.action = null;
    }
};

// 取消確認操作
const cancelAction = () => {
    confirmModal.show = false;
    confirmModal.action = null;
};

// 從資料庫獲取娃娃詳情
const fetchDollDetails = async () => {
    isLoading.value = true;
    try {
        const dollId = route.params.id;
        if (!dollId) {
            throw new Error('未指定娃娃ID');
        }

        const dollRef = dbRef(database, `dolls/${dollId}`);
        const snapshot = await get(dollRef);

        if (snapshot.exists()) {
            doll.value = {
                id: dollId,
                ...snapshot.val()
            };
        } else {
            throw new Error('找不到指定的娃娃數據');
        }
    } catch (error) {
        showAlert(`獲取詳情失敗: ${error.message}`, '錯誤');
        doll.value = null;
    } finally {
        isLoading.value = false;
    }
};

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '未知時間';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error("日期格式化錯誤:", error);
        return dateString;
    }
};

// 格式化貨幣
const formatCurrency = (doll) => {
    if (!doll.price) return '無價格';

    // 標準化貨幣格式
    let currencyStr = '';

    // 處理已經是新格式的情況
    if (doll.currency && doll.currency.includes(' ')) {
        currencyStr = doll.currency;
    }
    // 處理舊格式數據
    else if (doll.currency === 'NT$') {
        currencyStr = 'NT$ 台幣';
    }
    else if (doll.currency === 'HK$') {
        currencyStr = 'HK$ 港幣';
    }
    else if (doll.currency === '¥' && !doll.currency.includes('CNY')) {
        currencyStr = '¥ 日元';
    }
    else if (doll.currency === '$') {
        currencyStr = '$ 美元';
    }
    else if (doll.currency === '€') {
        currencyStr = '€ 歐元';
    }
    else if (doll.currency === '¥ CNY' || (doll.currency && doll.currency.includes('CNY'))) {
        currencyStr = '¥ 人民幣';
    }
    else {
        // 預設情況
        currencyStr = 'NT$ 台幣';
    }

    return currencyStr + ' ' + doll.price;
};

// 處理圖片加載錯誤
const handleImageError = () => {
    if (doll.value) {
        doll.value.imageUrl = "https://via.placeholder.com/400x400";
    }
};

// 編輯娃娃
const editDoll = () => {
    // 檢查是否已經通過驗證
    if (isValidAuth()) {
        startEditDoll();
        return;
    }

    passwordModalConfig.title = '編輯項目驗證';
    passwordModalConfig.message = '請輸入管理密碼以編輯項目';
    passwordModalConfig.actionType = 'edit';
    showPasswordModal.value = true;
};

// 實際開始編輯操作
const startEditDoll = () => {
    if (!doll.value || !doll.value.id) {
        showAlert('無法編輯，娃娃資料不完整', '錯誤');
        return;
    }

    router.push({
        path: `/edit/${doll.value.id}`
    });
};

// 刪除娃娃
const deleteDoll = async () => {
    if (!doll.value || !doll.value.id) return;

    // 檢查是否已經通過驗證
    if (isValidAuth()) {
        startDeleteDoll();
        return;
    }

    passwordModalConfig.title = '刪除項目驗證';
    passwordModalConfig.message = '請輸入管理密碼以刪除項目';
    passwordModalConfig.actionType = 'delete';
    showPasswordModal.value = true;
};

// 密碼驗證成功後的回調
const onPasswordSuccess = () => {
    showPasswordModal.value = false;

    // 根據不同的操作類型執行相應的操作
    if (passwordModalConfig.actionType === 'edit') {
        startEditDoll();
    } else if (passwordModalConfig.actionType === 'delete') {
        startDeleteDoll();
    }
};

// 取消密碼驗證
const onPasswordCancel = () => {
    showPasswordModal.value = false;
};

// 格式化入手日期
const formatPurchaseDate = (dateString) => {
    if (!dateString) return '未知日期';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error("入手日期格式化錯誤:", error);
        return dateString;
    }
};

// 實際開始刪除操作
const startDeleteDoll = async () => {
    const performDelete = async () => {
        try {
            const dollRef = dbRef(database, `dolls/${doll.value.id}`);
            await remove(dollRef);
            showAlert('娃娃已成功刪除！', '成功', () => {
                router.push('/');
            });
        } catch (error) {
            showAlert(`刪除失敗: ${error.message}`, '錯誤');
        }
    };

    showConfirm('確定要刪除這個娃娃嗎？這個操作不可撤銷！', performDelete, '刪除確認');
};

// 初始載入詳情
onMounted(() => {
    fetchDollDetails();
});
</script>

<style scoped>
/* 蒂芬妮綠色變量 */
:root {
    --tiffany-blue: #0abab5;
    --tiffany-dark: #089994;
    --tiffany-light: #e8f7f6;
    --tiffany-accent: #1ac0ba;
}

.detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    background-color: white;
}

.back-link {
    margin-bottom: 20px;
}

.back-button {
    display: inline-block;
    padding: 8px 15px;
    background-color: #f0f0f0;
    color: #333;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
}

.back-button:hover {
    background-color: #e0e0e0;
}

.detail-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.detail-title {
    font-size: 28px;
    color: #333;
    margin: 0;
    margin-right: 15px;
}

.tag {
    padding: 4px 10px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    font-weight: 500;
}

.tag.blue {
    background-color: var(--tiffany-blue);
}

.tag.green {
    background-color: #64b36e;
}

.tag.red {
    background-color: #f44336;
}

.tag.orange {
    background-color: #ff9800;
}

.tag.tiffany {
    background-color: var(--tiffany-accent);
}

.tag.purple {
    background-color: #9c27b0;
}

.tag.yellow {
    background-color: #ffc107;
}

.tag.brown {
    background-color: #795548;
}

.tag.pink {
    background-color: #e91e63;
}

.tag.gray {
    background-color: #607d8b;
}

.detail-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.detail-image-container {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detail-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    max-height: 500px;
    border-radius: 8px;
}

.detail-image:hover {
    transform: none;
}

.detail-info {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.detail-section {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.detail-section h2 {
    font-size: 18px;
    color: var(--tiffany-blue);
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
}

.info-table {
    width: 100%;
    border-collapse: collapse;
}

.info-table tr {
    border-bottom: 1px solid #eee;
}

.info-table tr:last-child {
    border-bottom: none;
}

.info-table td {
    padding: 10px 0;
}

.info-table .label {
    font-weight: 500;
    color: #555;
    width: 30%;
}

.info-table .value {
    color: #333;
}

.notes-content {
    white-space: pre-line;
    color: #555;
    line-height: 1.5;
}

.purchase-link {
    color: var(--tiffany-blue);
    text-decoration: none;
    word-break: break-all;
}

.purchase-link:hover {
    text-decoration: underline;
}

.detail-actions {
    margin-top: auto;
    display: flex;
    gap: 10px;
}

.edit-button,
.delete-button {
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
}

.edit-button {
    background-color: var(--tiffany-blue);
    color: white;
}

.edit-button:hover {
    background-color: var(--tiffany-dark);
}

.delete-button {
    background-color: #f44336;
    color: white;
}

.delete-button:hover {
    background-color: #d32f2f;
}

/* 加載指示器 */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(10, 186, 181, 0.2);
    border-radius: 50%;
    border-top-color: var(--tiffany-blue);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 空數據狀態 */
.empty-state {
    text-align: center;
    padding: 40px;
    color: #666;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-top: 30px;
}

.empty-state .back-link {
    color: var(--tiffany-blue);
    text-decoration: none;
    margin-top: 10px;
    display: inline-block;
}

/* 響應式設計 */
@media (max-width: 768px) {
    .detail-body {
        grid-template-columns: 1fr;
    }

    .detail-image-container {
        margin-bottom: 20px;
    }

    .detail-title {
        font-size: 24px;
    }
}
</style>