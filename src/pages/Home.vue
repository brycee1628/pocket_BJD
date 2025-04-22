<template>
    <div class="container">
        <h1 class="title">娃娃收藏清單</h1>

        <div class="header-actions">
            <button class="add-button" @click="showAddForm = true">新增項目</button>
            <div class="stats">
                <span>總數量: {{ totalCount }}</span>
                <span>總價值: {{ totalValue }}</span>
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

        <!-- 加載指示器 -->
        <div class="loading" v-if="isLoading">
            <div class="spinner"></div>
            <p>加載中...</p>
        </div>

        <!-- 空數據提示 -->
        <div class="empty-state" v-else-if="dolls.length === 0">
            <p>目前沒有娃娃數據。點擊「新增項目」添加您的第一個娃娃吧！</p>
        </div>

        <div class="doll-grid" v-else>
            <div class="doll-card" v-for="doll in dolls" :key="doll.id">
                <div class="doll-image">
                    <img :src="doll.imageUrl" alt="娃娃圖片" @error="handleImageError($event, doll)">
                    <span class="tag" :class="doll.tagType">{{ doll.tag }}</span>
                </div>
                <div class="doll-info">
                    <h3 class="doll-name">{{ doll.name }}</h3>
                    <div class="doll-details">
                        <div class="detail-row">
                            <span class="label">製作者:</span>
                            <span class="value">{{ doll.brand }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">價格:</span>
                            <span class="value">{{ formatCurrency(doll) }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">產地:</span>
                            <span class="value">{{ doll.location }}</span>
                        </div>
                        <div v-if="doll.size" class="detail-row">
                            <span class="label">尺寸:</span>
                            <span class="value">{{ doll.size }}</span>
                        </div>
                        <div v-if="doll.color" class="detail-row">
                            <span class="label">顏色:</span>
                            <span class="value">{{ doll.color }}</span>
                        </div>
                        <div v-if="doll.link" class="detail-row">
                            <a :href="doll.link" class="purchase-link">購買連結</a>
                        </div>
                        <div v-if="doll.notes" class="detail-row notes">
                            {{ doll.notes }}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="edit-button" @click="editDoll(doll)">編輯</button>
                        <button class="delete-button" @click="deleteDoll(doll.id)">刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
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

const searchQuery = ref('');
const showAddForm = ref(false);
const showEditForm = ref(false);
const isLoading = ref(true);
const currentEditId = ref(null);

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
    tagType: 'blue',
    link: '',
    notes: '',
    size: '',
    color: '',
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
    tag: '眼珠',
    tagType: 'blue',
    link: '',
    notes: '',
    size: '',
    color: '',
    imageUrl: '',
    newImageFile: null,
    newImageUrl: ''
});

// 數據存儲
const dolls = ref([]);

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
        console.error("未提供文件！");
        throw new Error("未提供文件！");
    }

    console.log("開始上傳圖片，文件大小:", file.size);

    try {
        // 創建唯一文件名
        const timestamp = new Date().getTime();
        const fileName = `doll_images/${timestamp}_${file.name}`;
        console.log("生成的文件名:", fileName);

        // 創建存儲引用
        const imgRef = storageRef(storage, fileName);

        // 上傳文件
        const snapshot = await uploadBytes(imgRef, file);
        console.log("文件上傳完成", snapshot);

        // 獲取下載URL
        const downloadURL = await getDownloadURL(imgRef);
        console.log("獲取到下載URL:", downloadURL);

        return downloadURL;
    } catch (error) {
        console.error("圖片上傳過程中發生錯誤:", error);
        throw error;
    }
};

const totalCount = computed(() => {
    return dolls.value.length;
});

// 計算總價值
const totalValue = computed(() => {
    let total = 0;

    dolls.value.forEach(doll => {
        if (doll.price && !isNaN(parseFloat(doll.price))) {
            let price = parseFloat(doll.price);

            // 使用保存的匯率進行轉換
            if (doll.currency === 'HK$ 港幣') price *= exchangeRates['HK$ 港幣'];
            else if (doll.currency === '¥ 日元') price *= exchangeRates['¥ 日元'];
            else if (doll.currency === '$ 美元') price *= exchangeRates['$ 美元'];
            else if (doll.currency === '€ 歐元') price *= exchangeRates['€ 歐元'];
            else if (doll.currency === '¥ 人民幣') price *= exchangeRates['¥ 人民幣'];
            // 處理舊數據
            else if (doll.currency === 'HK$') price *= exchangeRates['HK$ 港幣'];
            else if (doll.currency === '¥') price *= exchangeRates['¥ 日元'];
            else if (doll.currency === '$') price *= exchangeRates['$ 美元'];
            else if (doll.currency === '€') price *= exchangeRates['€ 歐元'];
            else if (doll.currency === '¥ CNY') price *= exchangeRates['¥ 人民幣'];

            total += price;
        }
    });

    return `NT$ ${total.toFixed(2)}`;
});

// 獲取最新匯率
const fetchExchangeRates = async () => {
    try {
        console.log("嘗試獲取最新匯率...");
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
            console.log("匯率更新成功:", exchangeRates);
        }
    } catch (error) {
        console.error("獲取匯率失敗，使用預設值:", error);
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
            console.log("圖片已轉換為 Base64 格式");
        };
        reader.readAsDataURL(file);
    }
};

const resetForm = () => {
    Object.keys(newItem).forEach(key => {
        if (key !== 'tag' && key !== 'tagType' && key !== 'currency') {
            newItem[key] = '';
        } else if (key === 'tag') {
            newItem[key] = '眼珠';
        } else if (key === 'tagType') {
            newItem[key] = 'blue';
        } else if (key === 'currency') {
            newItem[key] = 'NT$ 台幣';
        }
    });
    newItem.imageFile = null;
    newItem.imageUrl = '';
    showAddForm.value = false;
};

const addNewItem = async () => {
    if (!newItem.name) {
        alert('請輸入娃娃名稱！');
        return;
    }

    isLoading.value = true;
    let imageUrl = 'https://via.placeholder.com/150';

    try {
        // 使用Base64圖片而非上傳到Storage
        if (newItem.imageUrl) {
            // 直接使用Base64圖片
            imageUrl = newItem.imageUrl;
            console.log("使用Base64圖片");
        } else {
            console.log("未選擇圖片，使用預設圖片");
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
            imageUrl: imageUrl,
            createdAt: new Date().toISOString()
        };

        console.log("準備保存的數據:", item);

        // 保存到數據庫
        await set(newItemRef, item);
        console.log("數據保存成功，ID:", newItemRef.key);

        // 重置表單
        resetForm();
        alert('娃娃資料添加成功！');

        // 刷新數據列表
        fetchDolls();
    } catch (error) {
        console.error("保存數據時發生錯誤:", error);
        if (error.code) console.error("錯誤代碼:", error.code);
        if (error.message) console.error("錯誤信息:", error.message);
        alert(`保存失敗: ${error.message || '未知錯誤'}`);
    } finally {
        isLoading.value = false;
    }
};

// 刪除娃娃項目
const deleteDoll = async (id) => {
    if (confirm('確定要刪除這個項目嗎？')) {
        try {
            const dollRef = dbRef(database, `dolls/${id}`);
            await remove(dollRef);
            console.log("項目已刪除");
        } catch (error) {
            console.error("刪除錯誤:", error);
        }
    }
};

// 測試數據庫連接
const testDatabaseConnection = async () => {
    try {
        console.log("===== 開始測試數據庫連接 =====");
        console.log("Database 對象:", database);

        // 嘗試先讀取一下測試數據
        const testRef = dbRef(database, 'test');
        console.log("測試數據庫引用創建成功");

        // 嘗試寫入數據
        await set(testRef, {
            timestamp: Date.now(),
            message: "測試連接成功",
            appInfo: "BJD Doll Collection App"
        });

        console.log("測試數據寫入成功!");
        return true;
    } catch (error) {
        console.error("Firebase Realtime Database 連接測試失敗:", error);
        alert("數據庫連接失敗: " + error.message + "。請檢查控制台獲取更多信息。");
        return false;
    }
};

// 頁面載入時獲取數據
onMounted(() => {
    console.log("頁面已載入，開始測試數據庫和獲取數據");

    // 獲取最新匯率
    fetchExchangeRates();

    // 測試數據庫連接
    testDatabaseConnection().then((success) => {
        // 只有在測試成功後才獲取數據
        if (success) {
            console.log("開始獲取娃娃數據...");
            fetchDolls();
        } else {
            isLoading.value = false; // 停止加載指示器
        }
    }).catch(error => {
        console.error("無法開始獲取數據:", error);
        isLoading.value = false; // 停止加載指示器
    });
});

const handleImageError = (event, doll) => {
    console.error("圖片加載失敗:", event);
    console.error("娃娃資料:", doll);
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
    editingItem.imageUrl = doll.imageUrl || '';
    editingItem.newImageFile = null;
    editingItem.newImageUrl = '';

    showEditForm.value = true;
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
            console.log("編輯圖片已轉換為 Base64 格式");
        };
        reader.readAsDataURL(file);
    }
};

// 更新項目
const updateItem = async () => {
    if (!editingItem.name) {
        alert('請輸入娃娃名稱！');
        return;
    }

    isLoading.value = true;
    try {
        // 如果有新圖片，使用新的Base64圖片
        let imageUrl = editingItem.imageUrl;
        if (editingItem.newImageUrl) {
            imageUrl = editingItem.newImageUrl;
            console.log("使用新的Base64圖片");
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
            imageUrl: imageUrl,
            updatedAt: new Date().toISOString()
        };

        console.log("準備更新的數據:", updatedItem);

        // 更新數據庫
        await update(dollRef, updatedItem);
        console.log("數據更新成功");

        // 關閉表單
        showEditForm.value = false;
        currentEditId.value = null;
        alert('娃娃資料更新成功！');

        // 刷新數據列表
        fetchDolls();
    } catch (error) {
        console.error("更新數據時發生錯誤:", error);
        if (error.code) console.error("錯誤代碼:", error.code);
        if (error.message) console.error("錯誤信息:", error.message);
        alert(`更新失敗: ${error.message || '未知錯誤'}`);
    } finally {
        isLoading.value = false;
    }
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
</style>