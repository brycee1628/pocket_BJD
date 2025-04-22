<template>
    <div class="alert-modal" v-if="visible">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="close-button" @click="close">×</button>
            </div>
            <div class="modal-body">
                <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
                <button class="confirm-button" @click="close">確定</button>
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
        default: '提示'
    },
    message: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<style scoped>
.alert-modal {
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
    justify-content: center;
    border-top: 1px solid #eee;
}

.confirm-button {
    padding: 8px 20px;
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
</style>