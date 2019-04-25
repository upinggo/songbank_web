<template>
    <transition name="modal-fade">
        <!-- 关闭模态框事件 和 控制模态框是否显示 -->
        <div class="modal-backdrop"   v-show="show">
            <div  class="modal">
               
                <div class="modal-body" id="modalDescription">
                   
                    <!-- 状态提示文字的插槽 -->
                    <h1 name="status">{{statusText}}</h1>
                    
                </div>
                <!-- 模态框内容文字 可有可无 -->
                <div class="modal-title" v-if="mtitle">
                    来自:系统<br/>
                    时间:{{mtitle}}
                </div>
                <div class="modal-content" v-if="contentText">
                主题:{{contentText.msgtitle}}<br/>
                    {{contentText.msgcontent}}                    
                    
                </div>
                <ul>
                    <!-- 模态框按钮  可选单个确定按钮 和 两个确定、取消按钮 -->
                    <!-- 单个确定按钮 -->
                    <li v-if="alert"  class="greenBackground" @click.stop="$emit('button')">关闭</li>
                    <!-- 确定和取消按钮 -->
                    <li v-else class="confirm">
                        <div>取消</div>
                        <div class="blueBackground" @click.stop="$emit('confirm')">{{sure}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </transition>
    </template>
    <script>
    export default {    
        name:'modal',    // 通过 props 传值
    props: {        
          
        title:String,  //标题文字
        show:{      //显示取消
            type:Boolean,            
            default:false
        },     
           mtitle:String,
        statusText:String,   //状态文字
        contentText:Object,   //描述文字
        // buttonBackground:String, //按钮背景色
        alert:String,   //判断一个还是两个按钮
        sure:String, //第二个按钮的提示文字
        
    },
    data(){        
        return{            
            closemodal:"close",            // 
            isModalVisible:false,
            // 确定和取消按钮的两种颜色
           
        }
    },    
    methods:{        // 关闭模态框事件
        close(){            
            this.$emit('close',$event)
        },
    }
}
</script>
<style lang="less" scoped> 
.modal-backdrop {
    position: fixed; 
    top: 0; 
    right: 0; 
    bottom: 0; 
    left: 0; 
    background-color: rgba(0,0,0,.3); 
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 12;
    .modal { 
        
        background-color: #fff; 
        box-shadow: 2px 2px 20px 1px; 
        overflow-x:auto; 
        display: flex; 
        flex-direction: column; 
        width: 50%;
        position: relative;
        border-radius: 2%;
        height:50%;
        // .modal-header{ 
            
        //     width: 50%;
        //     height: 100%;
        //     // box-sizing: border-box; 
            
        //     div{
        //         width: 100%;
        //         height: 100%;
        //         background: #000;
        //     }
        // } 
        .modal-body{
            // line-height:10%;
            padding:50px 50px 10px;
            text-align:left;
           border-bottom:1px solid grey;
            // height: 10%;
            // margin-bottom: 0.8rem;
            box-sizing: border-box;
            // display: flex;
            // justify-content: space-between; 
            // align-items: center; 
            li{
                text-decoration:none;
                width: 2rem;
                height: 0.04rem;
                background: #eeeee5;
            }
        }
        .modal-title{
            padding:10px 50px 10px;
            line-height:30px;
            text-align:left;
            color:grey;
        }
        .modal-content{
            // width: 100%;
            padding:10px 50px 10px;
            line-height:30px;
            text-align:left;
            color:grey;
            overflow:auto;
            margin-bottom: 100px;
            color: #34304B;
            span{
                color: #32B8B9;
                i{
                    color: #4F4F4F;
                }
            }
        }
        ul{
             position:absolute;
                bottom:0;
                left:0;
                right:0;
                width:30%;
                padding:50px;
                margin:0 auto;
            li{
                width: 100%;
                height: 1.52rem;
                line-height: 1.52rem;
                text-align: center;
                color: #fff;
                font-size: 0.56rem;
                letter-spacing: 0.4rem;
            }
            .confirm{
               
                display: flex;
                div:nth-child(1){
                    flex: 1;
                    background: #DEDEDE;
                    color: #BCBBBF;
                }
                div:nth-child(2){
                    flex: 1;
                    color: #fff;
                }
            }
        }
        .blueBackground{
            background: #21A6DF;
        }
        .greenBackground{
            background: green;
        }
    } 
}
/* 动画 */
.modal-fade-enter,.modal-fade-leave-active{
    opacity: 0;
}
.modal-fade-enter-active, .modal-fade-leave-active{
    transition: opacity 0.5s ease;
}</style>
