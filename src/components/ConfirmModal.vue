<template>
    <div class="confirm-modal" v-if="visible">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="close-button" @click="cancel">×</button>
            </div>
            <div class="modal-body">
                <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
                <button class="cancel-button" @click="cancel">取消</button>
                <button class="confirm-button" @click="confirm">確定</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    visible: Boolean,
    title: {
        type: String,
        default: '確認'
    },
    message: {
        type: String,
        default: '確定要執行此操作嗎？'
    }
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
    emit('confirm');
};

const cancel = () => {
    emit('cancel');
};
</script>

<style scoped>
.confirm-modal {
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
    text-align: center;
}

.modal-footer {
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #eee;
}

.cancel-button {
    padding: 8px 15px;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.confirm-button {
    padding: 8px 15px;
    background-color: #0abab5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.confirm-button:hover {
    background-color: #089994;
}

.cancel-button:hover {
    background-color: #e4e4e4;
}
</style>