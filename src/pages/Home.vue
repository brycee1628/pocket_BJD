<template>
    <div class="container">
        <h1 class="title">娃娃收藏清單</h1>

        <div class="header-actions">
            <button class="add-button" @click="showPasswordForAddItem">新增項目</button>
            <div class="stats">
                <span>總數量: {{ totalCount }}</span>
                <span>總價值: {{ totalValue }}</span>
            </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-container">
            <input type="text" v-model="searchQuery" placeholder="搜尋" class="search-input" @input="handleSearch" />
            <div class="filter-options">
                <select v-model="filterTag" @change="handleSearch">
                    <option value="">所有類別</option>
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
                <select v-model="sortOrder" @change="handleSearch">
                    <option value="newest">最新添加</option>
                    <option value="oldest">最早添加</option>
                    <option value="priceHigh">價格由高到低</option>
                    <option value="priceLow">價格由低到高</option>
                    <option value="nameAZ">名稱 A-Z</option>
                    <option value="nameZA">名稱 Z-A</option>
                </select>
            </div>
            <div class="search-results-info" v-if="searchQuery || filterTag">
                找到 <span class="result-count">{{ filteredDolls.length }}</span> 個結果
                <button class="clear-search" @click="clearSearch">清除搜索</button>
            </div>
        </div>

        <!-- 新增項目表單 -->
        <div class="modal" v-if="showAddForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>新增項目</h2>
                    <button class="close-button" @click="showAddForm = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>品項名稱</label>
                        <input type="text" v-model="newItem.name" placeholder="輸入品項名稱" />
                    </div>
                    <div class="form-group">
                        <label>價格</label>
                        <div class="price-input">
                            <input type="text" v-model="newItem.price" placeholder="輸入價格" />
                            <select v-model="newItem.currency">
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
                        <label>類別</label>
                        <select v-model="newItem.tag">
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
                        <label>製作者</label>
                        <input type="text" v-model="newItem.brand" placeholder="輸入製作者" />
                    </div>
                    <div class="form-group">
                        <label>產地</label>
                        <input type="text" v-model="newItem.location" placeholder="輸入產地" />
                    </div>
                    <div class="form-group">
                        <label>購買連結</label>
                        <input type="text" v-model="newItem.link" placeholder="輸入購買連結" />
                    </div>
                    <div class="form-group">
                        <label>備註</label>
                        <textarea v-model="newItem.notes" placeholder="輸入備註"></textarea>
                    </div>
                    <div class="form-group">
                        <label>尺寸</label>
                        <input type="text" v-model="newItem.size" placeholder="輸入尺寸，例如: 18mm, 60cm" />
                    </div>
                    <div class="form-group">
                        <label>顏色</label>
                        <input type="text" v-model="newItem.color" placeholder="輸入顏色" />
                    </div>
                    <div class="form-group">
                        <label>入手日期</label>
                        <input type="date" v-model="newItem.purchaseDate" />
                    </div>
                    <div class="form-group">
                        <label>圖片</label>
                        <div class="image-upload">
                            <label for="imageUpload" class="upload-btn">選擇圖片</label>
                            <input type="file" id="imageUpload" @change="onImageSelected" accept="image/*"
                                style="display:none" />
                            <span v-if="newItem.imageFile">已選擇: {{ newItem.imageFile.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-button" @click="showAddForm = false">取消</button>
                    <button class="submit-button" @click="addNewItem">儲存</button>
                </div>
            </div>
        </div>

        <!-- 編輯項目表單 -->
        <div class="modal" v-if="showEditForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>編輯項目</h2>
                    <button class="close-button" @click="showEditForm = false">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>品項名稱</label>
                        <input type="text" v-model="editingItem.name" placeholder="輸入品項名稱" />
                    </div>
                    <div class="form-group">
                        <label>價格</label>
                        <div class="price-input">
                            <input type="text" v-model="editingItem.price" placeholder="輸入價格" />
                            <select v-model="editingItem.currency">
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
                        <label>類別</label>
                        <select v-model="editingItem.tag">
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
                        <label>製作者</label>
                        <input type="text" v-model="editingItem.brand" placeholder="輸入製作者" />
                    </div>
                    <div class="form-group">
                        <label>產地</label>
                        <input type="text" v-model="editingItem.location" placeholder="輸入產地" />
                    </div>
                    <div class="form-group">
                        <label>購買連結</label>
                        <input type="text" v-model="editingItem.link" placeholder="輸入購買連結" />
                    </div>
                    <div class="form-group">
                        <label>備註</label>
                        <textarea v-model="editingItem.notes" placeholder="輸入備註"></textarea>
                    </div>
                    <div class="form-group">
                        <label>尺寸</label>
                        <input type="text" v-model="editingItem.size" placeholder="輸入尺寸，例如: 18mm, 60cm" />
                    </div>
                    <div class="form-group">
                        <label>顏色</label>
                        <input type="text" v-model="editingItem.color" placeholder="輸入顏色" />
                    </div>
                    <div class="form-group">
                        <label>入手日期</label>
                        <input type="date" v-model="editingItem.purchaseDate" />
                    </div>
                    <div class="form-group">
                        <label>圖片</label>
                        <div class="image-upload">
                            <label for="editImageUpload" class="upload-btn">選擇新圖片</label>
                            <input type="file" id="editImageUpload" @change="onEditImageSelected" accept="image/*"
                                style="display:none" />
                            <span v-if="editingItem.newImageFile">已選擇: {{ editingItem.newImageFile.name }}</span>
                        </div>
                        <div class="current-image" v-if="editingItem.imageUrl">
                            <img :src="editingItem.imageUrl" alt="當前圖片"
                                style="max-width: 100px; max-height: 100px; margin-top: 10px;">
                            <p>當前圖片</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-button" @click="showEditForm = false">取消</button>
                    <button class="submit-button" @click="updateItem">更新</button>
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

        <!-- 加載指示器 -->
        <div class="loading" v-if="isLoading">
            <div class="spinner"></div>
            <p>加載中...</p>
        </div>

        <!-- 空數據提示 -->
        <div class="empty-state" v-else-if="dolls.length === 0">
            <p>目前沒有娃娃數據。點擊「新增項目」添加您的第一個娃娃吧！</p>
        </div>

        <!-- 沒有搜索結果提示 -->
        <div class="empty-state" v-else-if="filteredDolls.length === 0">
            <p>沒有找到匹配的娃娃。請嘗試更改搜索條件。</p>
        </div>

        <div class="doll-grid" v-else>
            <div class="doll-card" v-for="doll in filteredDolls" :key="doll.id" @click="viewDollDetail(doll.id)">
                <div class="doll-image">
                    <img :src="doll.imageUrl" alt="娃娃圖片" @error="handleImageError($event, doll)">
                    <span class="tag" :class="doll.tagType">{{ doll.tag }}</span>
                </div>
                <div class="doll-info">
                    <h3 class="doll-name" v-html="highlightText(doll.name)"></h3>
                    <div class="doll-details">
                        <div class="detail-row">
                            <span class="label">製作者:</span>
                            <span class="value" v-html="highlightText(doll.brand)"></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">價格:</span>
                            <span class="value">{{ formatCurrency(doll) }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">產地:</span>
                            <span class="value" v-html="highlightText(doll.location)"></span>
                        </div>
                        <div v-if="doll.size" class="detail-row">
                            <span class="label">尺寸:</span>
                            <span class="value" v-html="highlightText(doll.size)"></span>
                        </div>
                        <div v-if="doll.color" class="detail-row">
                            <span class="label">顏色:</span>
                            <span class="value" v-html="highlightText(doll.color)"></span>
                        </div>
                        <div v-if="doll.link" class="detail-row">
                            <a :href="doll.link" class="purchase-link" @click.stop>購買連結</a>
                        </div>
                        <div v-if="doll.notes" class="detail-row notes" v-html="highlightText(doll.notes)">
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="edit-button" @click.stop="editDoll(doll)">編輯</button>
                        <button class="delete-button" @click.stop="deleteDoll(doll.id)">刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
    database,
    storage,
    ref as dbRef,
    storageRef,
    onValue,
    push,
    set,
    remove,
    uploadBytes,
    getDownloadURL,
    update
} from '../firebase';
import { isValidAuth } from '../auth';
import PasswordModal from '../components/PasswordModal.vue';
import AlertModal from '../components/AlertModal.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const router = useRouter();

const searchQuery = ref('');
const filterTag = ref('');
const sortOrder = ref('newest');
const showAddForm = ref(false);
const showEditForm = ref(false);
const isLoading = ref(true);
const currentEditId = ref(null);
const currentDeleteId = ref(null);
const currentEditDoll = ref(null);

// 添加匯率狀態
const exchangeRates = reactive({
    'HK$ 港幣': 4.0,  // 港幣兌台幣的匯率
    '¥ 日元': 0.22,   // 日幣兌台幣的匯率
    '$ 美元': 31.2,   // 美金兌台幣的匯率
    '€ 歐元': 34.0,    // 歐元兌台幣的匯率
    '¥ 人民幣': 4.3  // 人民幣兌台幣的匯率
});

const newItem = reactive({
    name: '',
    brand: '',
    price: '',
    currency: 'NT$ 台幣',
    location: '',
    tag: '娃頭',
    tagType: 'tiffany',
    link: '',
    notes: '',
    size: '',
    color: '',
    purchaseDate: new Date().toISOString().split('T')[0], // 今天的日期作為預設值
    imageFile: null,
    imageUrl: ''
});

// 編輯項目數據
const editingItem = reactive({
    id: '',
    name: '',
    brand: '',
    price: '',
    currency: 'NT$ 台幣',
    location: '',
    tag: '娃頭',
    tagType: 'tiffany',
    link: '',
    notes: '',
    size: '',
    color: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
    newImageFile: null,
    newImageUrl: ''
});

// 數據存儲
const dolls = ref([]);
const filteredDolls = computed(() => {
    let result = [...dolls.value];

    // 應用搜索查詢過濾
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(doll =>
            (doll.name && doll.name.toLowerCase().includes(query)) ||
            (doll.brand && doll.brand.toLowerCase().includes(query)) ||
            (doll.tag && doll.tag.toLowerCase().includes(query)) ||
            (doll.notes && doll.notes.toLowerCase().includes(query)) ||
            (doll.color && doll.color.toLowerCase().includes(query)) ||
            (doll.location && doll.location.toLowerCase().includes(query))
        );
    }

    // 按類別過濾
    if (filterTag.value) {
        result = result.filter(doll => doll.tag === filterTag.value);
    }

    // 排序
    switch (sortOrder.value) {
        case 'newest':
            result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            break;
        case 'oldest':
            result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
            break;
        case 'priceHigh':
            result.sort((a, b) => {
                const priceA = convertToNTD(a);
                const priceB = convertToNTD(b);
                return priceB - priceA;
            });
            break;
        case 'priceLow':
            result.sort((a, b) => {
                const priceA = convertToNTD(a);
                const priceB = convertToNTD(b);
                return priceA - priceB;
            });
            break;
        case 'nameAZ':
            result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'nameZA':
            result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
    }

    return result;
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

// 從 Firebase 讀取數據
const fetchDolls = () => {
    isLoading.value = true;
    const dollsRef = dbRef(database, 'dolls');

    onValue(dollsRef, (snapshot) => {
        const data = snapshot.val();
        const dollsList = [];

        if (data) {
            Object.keys(data).forEach((key) => {
                dollsList.push({
                    id: key,
                    ...data[key]
                });
            });
        }

        dolls.value = dollsList;
        isLoading.value = false;
    });
};

// 上傳圖片到 Firebase Storage
const uploadImage = async (file) => {
    if (!file) {
        throw new Error("未提供文件！");
    }

    try {
        // 創建唯一文件名
        const timestamp = new Date().getTime();
        const fileName = `doll_images/${timestamp}_${file.name}`;

        // 創建存儲引用
        const imgRef = storageRef(storage, fileName);

        // 上傳文件
        const snapshot = await uploadBytes(imgRef, file);

        // 獲取下載URL
        const downloadURL = await getDownloadURL(imgRef);

        return downloadURL;
    } catch (error) {
        throw error;
    }
};

// 計算總數量和價值要基於過濾後的數據
const totalCount = computed(() => {
    return filteredDolls.value.length;
});

// 計算總價值
const totalValue = computed(() => {
    let total = 0;

    filteredDolls.value.forEach(doll => {
        if (doll.price && !isNaN(parseFloat(doll.price))) {
            total += convertToNTD(doll);
        }
    });

    return `NT$ ${total.toFixed(2)}`;
});

// 獲取最新匯率
const fetchExchangeRates = async () => {
    try {
        // 這裡使用免費的匯率API (實際整合時請替換為可靠的服務提供商)
        const response = await fetch('https://open.er-api.com/v6/latest/TWD');
        const data = await response.json();

        if (data && data.rates) {
            // 轉換為台幣為基準的匯率
            exchangeRates['HK$ 港幣'] = 1 / data.rates.HKD || 4.0;
            exchangeRates['¥ 日元'] = 1 / data.rates.JPY || 0.22;
            exchangeRates['$ 美元'] = 1 / data.rates.USD || 31.2;
            exchangeRates['€ 歐元'] = 1 / data.rates.EUR || 34.0;
            exchangeRates['¥ 人民幣'] = 1 / data.rates.CNY || 4.3;
        }
    } catch (error) {
        // 匯率獲取失敗時使用預設值，已在初始化時設置
    }
};

const onImageSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        newItem.imageFile = file;

        // 創建一個 FileReader 來將圖片轉換為 Base64 編碼
        const reader = new FileReader();
        reader.onload = (e) => {
            // 將圖片保存為 Base64 字符串
            newItem.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const resetForm = () => {
    Object.keys(newItem).forEach(key => {
        if (key !== 'tag' && key !== 'tagType' && key !== 'currency' && key !== 'purchaseDate') {
            newItem[key] = '';
        } else if (key === 'tag') {
            newItem[key] = '娃頭';
        } else if (key === 'tagType') {
            newItem[key] = 'tiffany';
        } else if (key === 'currency') {
            newItem[key] = 'NT$ 台幣';
        } else if (key === 'purchaseDate') {
            newItem[key] = new Date().toISOString().split('T')[0];
        }
    });
    newItem.imageFile = null;
    newItem.imageUrl = '';
    showAddForm.value = false;
};

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

const addNewItem = async () => {
    if (!newItem.name) {
        showAlert('請輸入娃娃名稱！');
        return;
    }

    isLoading.value = true;
    let imageUrl = 'https://via.placeholder.com/150';

    try {
        // 使用Base64圖片而非上傳到Storage
        if (newItem.imageUrl) {
            // 直接使用Base64圖片
            imageUrl = newItem.imageUrl;
        }

        // 根據tag設定tagType
        let tagType = 'blue';
        if (newItem.tag === '眼珠') tagType = 'blue';
        else if (newItem.tag === '娃頭') tagType = 'tiffany';
        else if (newItem.tag === '素體') tagType = 'green';
        else if (newItem.tag === '娃整體') tagType = 'purple';
        else if (newItem.tag === '套裝') tagType = 'red';
        else if (newItem.tag === '單品') tagType = 'yellow';
        else if (newItem.tag === '鞋子') tagType = 'brown';
        else if (newItem.tag === '頭髮') tagType = 'pink';
        else if (newItem.tag === '配件') tagType = 'orange';
        else if (newItem.tag === '其他') tagType = 'gray';

        // 構建要保存的物品對象
        const dollsRef = dbRef(database, 'dolls');
        const newItemRef = push(dollsRef);
        const item = {
            name: newItem.name,
            brand: newItem.brand || '',
            price: newItem.price || 0,
            currency: newItem.currency || 'NT$ 台幣', // 修正預設幣別為台幣
            location: newItem.location || '',
            tag: newItem.tag || '',
            tagType: tagType,
            link: newItem.link || '',
            notes: newItem.notes || '',
            size: newItem.size || '',
            color: newItem.color || '',
            purchaseDate: newItem.purchaseDate || '',
            imageUrl: imageUrl,
            createdAt: new Date().toISOString()
        };

        // 保存到數據庫
        await set(newItemRef, item);

        // 重置表單
        resetForm();
        showAlert('娃娃資料添加成功！');

        // 刷新數據列表
        fetchDolls();
    } catch (error) {
        showAlert(`保存失敗: ${error.message || '未知錯誤'}`, '錯誤');
    } finally {
        isLoading.value = false;
    }
};

// 實際開始刪除操作
const startDeleteDoll = async (id) => {
    const performDelete = async () => {
        try {
            const dollRef = dbRef(database, `dolls/${id}`);
            await remove(dollRef);
        } catch (error) {
            showAlert(`刪除失敗: ${error.message || '未知錯誤'}`, '錯誤');
        }
    };

    showConfirm('確定要刪除這個項目嗎？', performDelete, '刪除確認');
};

// 密碼驗證成功後的回調
const onPasswordSuccess = () => {
    showPasswordModal.value = false;

    // 根據不同的操作類型執行相應的操作
    switch (passwordModalConfig.actionType) {
        case 'add':
            showAddForm.value = true;
            break;
        case 'edit':
            if (currentEditDoll.value) {
                startEditDoll(currentEditDoll.value);
                currentEditDoll.value = null;
            }
            break;
        case 'delete':
            if (currentDeleteId.value) {
                startDeleteDoll(currentDeleteId.value);
                currentDeleteId.value = null;
            }
            break;
    }
};

// 取消密碼驗證
const onPasswordCancel = () => {
    showPasswordModal.value = false;
    currentEditDoll.value = null;
    currentDeleteId.value = null;
};

// 頁面載入時獲取數據
onMounted(() => {
    fetchDolls();
    fetchExchangeRates();
});

const handleImageError = (event, doll) => {
    doll.imageUrl = "https://via.placeholder.com/200x200";
};

// 在script部分添加格式化函數
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

// 打開編輯表單
const editDoll = (doll) => {
    // 檢查是否已經通過驗證
    if (isValidAuth()) {
        startEditDoll(doll);
        return;
    }

    passwordModalConfig.title = '編輯項目驗證';
    passwordModalConfig.message = '請輸入管理密碼以編輯項目';
    passwordModalConfig.actionType = 'edit';
    // 暫存當前編輯的項目
    currentEditDoll.value = doll;
    showPasswordModal.value = true;
};

// 為編輯表單選擇圖片
const onEditImageSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        editingItem.newImageFile = file;

        // 創建一個 FileReader 來將圖片轉換為 Base64 編碼
        const reader = new FileReader();
        reader.onload = (e) => {
            // 將圖片保存為 Base64 字符串
            editingItem.newImageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// 更新項目
const updateItem = async () => {
    if (!editingItem.name) {
        showAlert('請輸入娃娃名稱！');
        return;
    }

    isLoading.value = true;
    try {
        // 如果有新圖片，使用新的Base64圖片
        let imageUrl = editingItem.imageUrl;
        if (editingItem.newImageUrl) {
            imageUrl = editingItem.newImageUrl;
        }

        // 根據tag設定tagType
        let tagType = 'blue';
        if (editingItem.tag === '眼珠') tagType = 'blue';
        else if (editingItem.tag === '娃頭') tagType = 'tiffany';
        else if (editingItem.tag === '素體') tagType = 'green';
        else if (editingItem.tag === '娃整體') tagType = 'purple';
        else if (editingItem.tag === '套裝') tagType = 'red';
        else if (editingItem.tag === '單品') tagType = 'yellow';
        else if (editingItem.tag === '鞋子') tagType = 'brown';
        else if (editingItem.tag === '頭髮') tagType = 'pink';
        else if (editingItem.tag === '配件') tagType = 'orange';
        else if (editingItem.tag === '其他') tagType = 'gray';

        // 構建要更新的物品對象
        const dollRef = dbRef(database, `dolls/${currentEditId.value}`);
        const updatedItem = {
            name: editingItem.name,
            brand: editingItem.brand || '',
            price: editingItem.price || 0,
            currency: editingItem.currency || 'NT$ 台幣',
            location: editingItem.location || '',
            tag: editingItem.tag || '',
            tagType: tagType,
            link: editingItem.link || '',
            notes: editingItem.notes || '',
            size: editingItem.size || '',
            color: editingItem.color || '',
            purchaseDate: editingItem.purchaseDate || '',
            imageUrl: imageUrl,
            updatedAt: new Date().toISOString()
        };

        // 更新數據庫
        await update(dollRef, updatedItem);

        // 關閉表單
        showEditForm.value = false;
        currentEditId.value = null;
        showAlert('娃娃資料更新成功！');

        // 刷新數據列表
        fetchDolls();
    } catch (error) {
        showAlert(`更新失敗: ${error.message || '未知錯誤'}`, '錯誤');
    } finally {
        isLoading.value = false;
    }
};

// 實際開始編輯操作
const startEditDoll = (doll) => {
    currentEditId.value = doll.id;

    // 複製數據到編輯對象
    editingItem.name = doll.name || '';
    editingItem.brand = doll.brand || '';
    editingItem.price = doll.price || '';
    editingItem.currency = doll.currency || 'NT$ 台幣';
    editingItem.location = doll.location || '';
    editingItem.tag = doll.tag || '眼珠';
    editingItem.tagType = doll.tagType || 'blue';
    editingItem.link = doll.link || '';
    editingItem.notes = doll.notes || '';
    editingItem.size = doll.size || '';
    editingItem.color = doll.color || '';
    editingItem.purchaseDate = doll.purchaseDate || new Date().toISOString().split('T')[0];
    editingItem.imageUrl = doll.imageUrl || '';
    editingItem.newImageFile = null;
    editingItem.newImageUrl = '';

    showEditForm.value = true;
};

// 添加查看詳情函數
const viewDollDetail = (id) => {
    router.push({
        name: 'Detail',
        params: { id: id }
    });
};

const showPasswordModal = ref(false);
const passwordModalConfig = reactive({
    title: '驗證密碼',
    message: '請輸入管理密碼以繼續操作',
    actionType: '' // 'add', 'edit', 'delete'
});

// 顯示密碼驗證（新增）
const showPasswordForAddItem = () => {
    // 檢查是否已經通過驗證
    if (isValidAuth()) {
        showAddForm.value = true;
        return;
    }

    passwordModalConfig.title = '新增項目驗證';
    passwordModalConfig.message = '請輸入管理密碼以新增項目';
    passwordModalConfig.actionType = 'add';
    showPasswordModal.value = true;
};

// 刪除娃娃項目
const deleteDoll = (id) => {
    // 檢查是否已經通過驗證
    if (isValidAuth()) {
        startDeleteDoll(id);
        return;
    }

    passwordModalConfig.title = '刪除項目驗證';
    passwordModalConfig.message = '請輸入管理密碼以刪除項目';
    passwordModalConfig.actionType = 'delete';
    // 暫存要刪除的ID
    currentDeleteId.value = id;
    showPasswordModal.value = true;
};

// 將不同幣值轉換為台幣的輔助函數
const convertToNTD = (doll) => {
    if (!doll.price || isNaN(parseFloat(doll.price))) return 0;

    let price = parseFloat(doll.price);

    // 使用保存的匯率進行轉換
    if (doll.currency === 'HK$ 港幣' || doll.currency === 'HK$')
        price *= exchangeRates['HK$ 港幣'];
    else if (doll.currency === '¥ 日元' || doll.currency === '¥')
        price *= exchangeRates['¥ 日元'];
    else if (doll.currency === '$ 美元' || doll.currency === '$')
        price *= exchangeRates['$ 美元'];
    else if (doll.currency === '€ 歐元' || doll.currency === '€')
        price *= exchangeRates['€ 歐元'];
    else if (doll.currency === '¥ 人民幣' || doll.currency === '¥ CNY')
        price *= exchangeRates['¥ 人民幣'];

    return price;
};

// 處理搜索和過濾
const handleSearch = () => {
    // 已通過computed屬性自動處理
};

// 清除搜索條件
const clearSearch = () => {
    searchQuery.value = '';
    filterTag.value = '';
    sortOrder.value = 'newest';
};

// 添加即時搜索關鍵詞高亮顯示功能
const highlightText = (text) => {
    if (!searchQuery.value || !text) return text || '';

    const query = searchQuery.value.toLowerCase();
    const highlightedText = String(text).replace(new RegExp(query, 'gi'), (match) => {
        return `<span class="highlight">${match}</span>`;
    });

    return highlightedText;
};
</script>

<style scoped>
/* 蒂芬妮綠色變量 */
:root {
    --tiffany-blue: #0abab5;
    /* 蒂芬妮藍綠色 */
    --tiffany-dark: #089994;
    /* 深一點的蒂芬妮綠，用於懸停效果 */
    --tiffany-light: #e8f7f6;
    /* 淺一點的蒂芬妮綠，用於背景等 */
    --tiffany-accent: #1ac0ba;
    /* 強調色 */
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

body {
    background-color: white;
    margin: 0;
    padding: 0;
}

.title {
    color: var(--tiffany-blue);
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: 600;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.add-button {
    background-color: var(--tiffany-blue);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.add-button:hover {
    background-color: var(--tiffany-dark);
}

.stats {
    display: flex;
    gap: 15px;
    font-size: 14px;
    color: #333;
}

.doll-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.doll-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(10, 186, 181, 0.2);
    min-width: 240px;
    min-height: 350px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.doll-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(10, 186, 181, 0.3);
}

.doll-image {
    height: 200px;
    position: relative;
    overflow: hidden;
}

.doll-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tag {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 3px 8px;
    border-radius: 4px;
    color: white;
    font-size: 12px;
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

.doll-info {
    padding: 15px;
}

.doll-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

.doll-details {
    margin-bottom: 15px;
}

.detail-row {
    margin-bottom: 5px;
    font-size: 14px;
}

.label {
    font-weight: 500;
    margin-right: 5px;
    color: #555;
}

.value {
    color: #333;
}

.purchase-link {
    color: var(--tiffany-blue);
    text-decoration: none;
}

.purchase-link:hover {
    color: var(--tiffany-dark);
    text-decoration: underline;
}

.notes {
    color: #666;
    font-style: italic;
    margin-top: 5px;
}

.card-actions {
    display: flex;
    gap: 10px;
}

.edit-button {
    background-color: var(--tiffany-blue);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    flex: 1;
}

.edit-button:hover {
    background-color: var(--tiffany-dark);
}

.delete-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    flex: 1;
}

/* 彈出表單樣式 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #444;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-group textarea {
    height: 80px;
    resize: vertical;
}

.upload-btn {
    display: inline-block;
    background-color: var(--tiffany-blue);
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.upload-btn:hover {
    background-color: var(--tiffany-dark);
}

.cancel-button {
    background-color: #f0f0f0;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    color: #333;
    cursor: pointer;
}

.submit-button {
    background-color: var(--tiffany-blue);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: var(--tiffany-dark);
}

.price-input {
    display: flex;
    gap: 10px;
}

.price-input input {
    flex: 1;
}

.price-input select {
    width: 100px;
}

/* 加載狀態 */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
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
    padding: 40px 0;
    color: #666;
    font-size: 16px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(10, 186, 181, 0.2);
    margin-top: 20px;
}

@media (max-width: 768px) {
    .header-actions {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .stats {
        flex-direction: column;
        gap: 5px;
    }

    .doll-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .doll-grid {
        grid-template-columns: 1fr;
    }
}

.search-container {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    box-shadow: 0 1px 3px rgba(10, 186, 181, 0.1);
}

.search-input:focus {
    outline: none;
    border-color: var(--tiffany-blue);
    box-shadow: 0 1px 3px rgba(10, 186, 181, 0.3);
}

.filter-options {
    display: flex;
    gap: 10px;
}

.filter-options select {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    flex: 1;
}

.filter-options select:focus {
    outline: none;
    border-color: var(--tiffany-blue);
}

.search-results-info {
    text-align: right;
    font-size: 14px;
    color: #666;
}

.result-count {
    font-weight: 500;
}

.clear-search {
    background: none;
    border: none;
    color: var(--tiffany-blue);
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
}

.highlight {
    background-color: rgba(10, 186, 181, 0.3);
    padding: 0 2px;
    border-radius: 2px;
    font-weight: bold;
}

@media (max-width: 768px) {
    .filter-options {
        flex-direction: column;
    }
}
</style>