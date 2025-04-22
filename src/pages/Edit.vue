<template>
    <div class="edit-container">
        <div class="back-link">
            <router-link :to="'/detail/' + id" class="back-button">← 返回詳情</router-link>
        </div>

        <!-- 加載指示器 -->
        <div class="loading" v-if="isLoading">
            <div class="spinner"></div>
            <p>加載中...</p>
        </div>

        <div class="edit-content" v-else>
            <h1 class="edit-title">編輯娃娃</h1>

            <div class="edit-form">
                <div class="form-group">
                    <label for="name">娃娃名稱</label>
                    <input type="text" id="name" v-model="dollForm.name" placeholder="輸入娃娃名稱" required>
                </div>

                <div class="form-group">
                    <label for="brand">製作者/品牌</label>
                    <input type="text" id="brand" v-model="dollForm.brand" placeholder="輸入製作者或品牌">
                </div>

                <div class="form-group price-group">
                    <label for="price">價格</label>
                    <div class="price-inputs">
                        <input type="number" id="price" v-model="dollForm.price" placeholder="輸入價格">
                        <select v-model="dollForm.currency">
                            <option value="NT$ 台幣">NT$ 台幣</option>
                            <option value="HK$ 港幣">HK$ 港幣</option>
                            <option value="¥ 日元">¥ 日元</option>
                            <option value="$ 美元">$ 美元</option>
                            <option value="€ 歐元">€ 歐元</option>
                            <option value="¥ 人民幣">¥ 人民幣</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="location">產地</label>
                    <input type="text" id="location" v-model="dollForm.location" placeholder="輸入產地">
                </div>

                <div class="form-group">
                    <label for="size">尺寸</label>
                    <input type="text" id="size" v-model="dollForm.size" placeholder="輸入尺寸，例如：1/6, 60cm">
                </div>

                <div class="form-group">
                    <label for="color">顏色</label>
                    <input type="text" id="color" v-model="dollForm.color" placeholder="輸入顏色">
                </div>

                <div class="form-group">
                    <label for="tag">類別</label>
                    <select id="tag" v-model="dollForm.tag">
                        <option value="娃頭">娃頭</option>
                        <option value="素體">素體</option>
                        <option value="娃整體">娃整體</option>
                        <option value="眼珠">眼珠</option>
                        <option value="套裝">套裝</option>
                        <option value="單品">單品</option>
                        <option value="鞋子">鞋子</option>
                        <option value="頭髮">頭髮</option>
                        <option value="配件">配件</option>
                        <option value="其他">其他</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="link">購買連結</label>
                    <input type="url" id="link" v-model="dollForm.link" placeholder="輸入購買連結">
                </div>

                <div class="form-group">
                    <label for="purchaseDate">入手日期</label>
                    <input type="date" id="purchaseDate" v-model="dollForm.purchaseDate">
                </div>

                <div class="form-group">
                    <label for="notes">備註</label>
                    <textarea id="notes" v-model="dollForm.notes" placeholder="輸入備註" rows="4"></textarea>
                </div>

                <div class="form-group">
                    <label>圖片</label>
                    <div class="image-preview" v-if="imageUrl">
                        <img :src="imageUrl" alt="娃娃圖片預覽">
                    </div>
                    <div class="image-upload">
                        <label for="imageUpload" class="upload-btn">選擇新圖片</label>
                        <input type="file" id="imageUpload" @change="handleImageChange" accept="image/*"
                            style="display:none">
                    </div>
                </div>

                <div class="form-actions">
                    <button class="cancel-btn" @click="cancelEdit">取消</button>
                    <button class="save-btn" @click="saveDoll" :disabled="isSaving">
                        {{ isSaving ? '保存中...' : '保存' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 自定義警告彈窗 -->
        <AlertModal :visible="alertModal.show" :title="alertModal.title" :message="alertModal.message"
            @close="closeAlertModal" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { database, ref as dbRef, get, set } from '../firebase';
import AlertModal from '../components/AlertModal.vue';

const router = useRouter();
const route = useRoute();
const id = route.params.id;
const isLoading = ref(true);
const isSaving = ref(false);
const imageUrl = ref('');
const imageChanged = ref(false);

const dollForm = reactive({
    name: '',
    brand: '',
    price: '',
    currency: 'NT$ 台幣',
    location: '',
    tag: '娃頭',
    notes: '',
    size: '',
    color: '',
    link: '',
    purchaseDate: ''
});

// 警告彈窗狀態
const alertModal = reactive({
    show: false,
    title: '提示',
    message: '',
    callback: null
});

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

// 獲取娃娃詳情
const fetchDollDetails = async () => {
    isLoading.value = true;
    try {
        const dollRef = dbRef(database, `dolls/${id}`);
        const snapshot = await get(dollRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            dollForm.name = data.name || '';
            dollForm.brand = data.brand || '';
            dollForm.price = data.price || '';
            dollForm.currency = data.currency || 'NT$ 台幣';
            dollForm.location = data.location || '';
            dollForm.tag = data.tag || '娃頭';
            dollForm.notes = data.notes || '';
            dollForm.size = data.size || '';
            dollForm.color = data.color || '';
            dollForm.link = data.link || '';
            dollForm.purchaseDate = data.purchaseDate || '';

            // 保存原始圖片URL
            if (data.imageUrl) {
                imageUrl.value = data.imageUrl;
            }
        } else {
            router.push('/');
            throw new Error('找不到指定的娃娃數據');
        }
    } catch (error) {
        showAlert(`獲取詳情失敗: ${error.message}`, '錯誤', () => {
            router.push('/');
        });
    } finally {
        isLoading.value = false;
    }
};

// 處理圖片上傳
const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageUrl.value = e.target.result;
            imageChanged.value = true;
        };
        reader.readAsDataURL(file);
    }
};

// 取消編輯
const cancelEdit = () => {
    router.push(`/detail/${id}`);
};

// 保存娃娃數據
const saveDoll = async () => {
    if (!dollForm.name) {
        showAlert('娃娃名稱是必填項！');
        return;
    }

    isSaving.value = true;

    try {
        // 根據tag設定tagType
        let tagType = 'blue';
        if (dollForm.tag === '眼珠') tagType = 'blue';
        else if (dollForm.tag === '娃頭') tagType = 'tiffany';
        else if (dollForm.tag === '素體') tagType = 'green';
        else if (dollForm.tag === '娃整體') tagType = 'purple';
        else if (dollForm.tag === '套裝') tagType = 'red';
        else if (dollForm.tag === '單品') tagType = 'yellow';
        else if (dollForm.tag === '鞋子') tagType = 'brown';
        else if (dollForm.tag === '頭髮') tagType = 'pink';
        else if (dollForm.tag === '配件') tagType = 'orange';
        else if (dollForm.tag === '其他') tagType = 'gray';

        // 準備要保存的數據
        const dollData = {
            name: dollForm.name,
            brand: dollForm.brand || '',
            price: dollForm.price || '',
            currency: dollForm.currency || 'NT$ 台幣',
            location: dollForm.location || '',
            tag: dollForm.tag || '',
            tagType: tagType,
            notes: dollForm.notes || '',
            size: dollForm.size || '',
            color: dollForm.color || '',
            link: dollForm.link || '',
            purchaseDate: dollForm.purchaseDate || '',
            imageUrl: imageUrl.value || '',
            updatedAt: new Date().toISOString()
        };

        // 更新數據庫
        const dollRef = dbRef(database, `dolls/${id}`);
        await set(dollRef, dollData);

        showAlert('娃娃資料已更新！', '成功', () => {
            router.push(`/detail/${id}`);
        });
    } catch (error) {
        showAlert(`更新失敗: ${error.message}`, '錯誤');
    } finally {
        isSaving.value = false;
    }
};

// 初始載入
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

.edit-container {
    max-width: 800px;
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

.edit-title {
    font-size: 24px;
    color: var(--tiffany-blue);
    margin-bottom: 25px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 500;
    color: #444;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.form-group textarea {
    resize: vertical;
}

.price-group .price-inputs {
    display: flex;
    gap: 10px;
}

.price-group .price-inputs input {
    flex: 1;
}

.price-group .price-inputs select {
    width: 120px;
}

.image-preview {
    margin-bottom: 10px;
}

.image-preview img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.image-upload .upload-btn {
    display: inline-block;
    padding: 10px 15px;
    background-color: var(--tiffany-blue);
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.image-upload .upload-btn:hover {
    background-color: var(--tiffany-dark);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
}

.cancel-btn,
.save-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
}

.cancel-btn {
    background-color: #f0f0f0;
    color: #333;
}

.save-btn {
    background-color: var(--tiffany-blue);
    color: white;
}

.save-btn:hover {
    background-color: var(--tiffany-dark);
}

.save-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

@media (max-width: 768px) {
    .edit-container {
        padding: 15px;
    }

    .edit-title {
        font-size: 20px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        font-size: 14px;
    }

    .price-group .price-inputs {
        flex-direction: column;
    }

    .price-group .price-inputs select {
        width: 100%;
    }
}
</style>