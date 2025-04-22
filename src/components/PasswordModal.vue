<template>
    <div class="password-modal" v-if="visible">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="close-button" @click="cancel">×</button>
            </div>
            <div class="modal-body">
                <p>{{ message }}</p>
                <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="請輸入密碼"
                        @keyup.enter="confirm" />
                    <button class="toggle-button" @click="showPassword = !showPassword">
                        {{ showPassword ? '隱藏' : '顯示' }}
                    </button>
                </div>
                <div class="error-message" v-if="errorMessage">
                    {{ errorMessage }}
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-button" @click="cancel">取消</button>
                <button class="confirm-button" @click="confirm">確認</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { verifyPassword } from '../auth';

const props = defineProps({
    visible: Boolean,
    title: {
        type: String,
        default: '驗證密碼'
    },
    message: {
        type: String,
        default: '請輸入管理密碼以繼續操作'
    }
});

const emit = defineEmits(['success', 'cancel']);

const password = ref('');
const errorMessage = ref('');
const showPassword = ref(false);

const confirm = () => {
    if (!password.value) {
        errorMessage.value = '請輸入密碼';
        return;
    }

    if (verifyPassword(password.value)) {
        emit('success');
        resetForm();
    } else {
        errorMessage.value = '密碼錯誤，請重試';
    }
};

const cancel = () => {
    emit('cancel');
    resetForm();
};

const resetForm = () => {
    password.value = '';
    errorMessage.value = '';
    showPassword.value = false;
};
</script>

<style scoped>
.password-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.modal-header h3 {
    margin: 0;
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

.input-group {
    display: flex;
    margin: 15px 0;
}

.input-group input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    font-size: 16px;
}

.toggle-button {
    padding: 10px 15px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-left: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
}

.error-message {
    color: #f44336;
    font-size: 14px;
    margin-top: 5px;
}

.modal-footer {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #eee;
}

.cancel-button,
.confirm-button {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.cancel-button {
    background-color: #f0f0f0;
    color: #333;
}

.confirm-button {
    background-color: #0abab5;
    color: white;
}

.confirm-button:hover {
    background-color: #089994;
}
</style>