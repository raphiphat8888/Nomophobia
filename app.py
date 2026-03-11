import streamlit as st
import pandas as pd
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor

# ตั้งค่าหน้าเว็บ
st.set_page_config(page_title="Nomophobia Dashboard", layout="wide", page_icon="📱")

# ฟังก์ชันโหลดข้อมูลและแคชไว้เพื่อความรวดเร็ว
@st.cache_data
def load_data():
    # โหลดไฟล์ CSV ของคุณ
    df = pd.read_csv('teen_phone_New.csv')
    return df

df = load_data()

# ส่วนหัวของเว็บ
st.title("📱 Nomophobia & Smartphone Usage Dashboard")
st.markdown("วิเคราะห์พฤติกรรมการใช้สมาร์ทโฟนและความเสี่ยงต่อโรค Nomophobia (ภาวะขาดมือถือไม่ได้)")

# สร้าง Tab 2 หน้า
tab1, tab2 = st.tabs(["📊 Dashboard วิเคราะห์ข้อมูล", "📝 แบบสอบถามประเมินความเสี่ยง Nomophobia"])

# ----------------- Tab 1: Dashboard -----------------
with tab1:
    st.header("ภาพรวมข้อมูลพฤติกรรมการใช้งาน")
    
    # แสดงตัวเลขสรุป
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("จำนวนผู้ตอบแบบสอบถาม", f"{len(df)} คน")
    col2.metric("ชั่วโมงการใช้เฉลี่ยต่อวัน", f"{df['Daily_Usage_Hours'].mean():.1f} ชม.")
    col3.metric("เวลาเช็คมือถือเฉลี่ย", f"{df['Phone_Checks_Per_Day'].mean():.0f} ครั้ง/วัน")
    col4.metric("ระดับการติดมือถือ (Addiction) เฉลี่ย", f"{df['Addiction_Level'].mean():.1f} / 10")
    
    st.divider()
    
    # กราฟที่ 1: การใช้งานมือถือต่อวันกับระดับการติดมือถือ
    st.subheader("ความสัมพันธ์ระหว่างการใช้งานมือถือต่อวันและระดับการติดมือถือ (Addiction Level)")
    fig1 = px.scatter(df, x='Daily_Usage_Hours', y='Addiction_Level', color='Gender', 
                      hover_data=['Age', 'Anxiety_Level'], opacity=0.7)
    st.plotly_chart(fig1, use_container_width=True)
    
    col_a, col_b = st.columns(2)
    with col_a:
        # กราฟที่ 2: ความถี่ในการเช็คโทรศัพท์ vs ความวิตกกังวล
        st.subheader("การเช็คโทรศัพท์ต่อวัน กับระดับความวิตกกังวล")
        fig2 = px.box(df, x='Anxiety_Level', y='Phone_Checks_Per_Day', color='Anxiety_Level')
        st.plotly_chart(fig2, use_container_width=True)
        
    with col_b:
        # กราฟที่ 3: Heatmap
        st.subheader("ความสัมพันธ์ (Correlation) ของปัจจัยต่างๆ")
        features_corr = ['Daily_Usage_Hours', 'Sleep_Hours', 'Anxiety_Level', 
                         'Screen_Time_Before_Bed', 'Phone_Checks_Per_Day', 'Addiction_Level']
        corr = df[features_corr].corr()
        fig_heat, ax = plt.subplots(figsize=(6,4))
        sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f", ax=ax)
        st.pyplot(fig_heat)

# ----------------- Tab 2: แบบสอบถามประเมิน -----------------
with tab2:
    st.header("แบบสอบถามประเมินความเสี่ยง Nomophobia")
    st.markdown("กรอกข้อมูลพฤติกรรมการใช้งานของคุณ เพื่อประเมินระดับความเสี่ยง โดยระบบจะนำข้อมูลของคุณไปเปรียบเทียบและทำนายผลด้วย Machine Learning ที่เรียนรู้จากฐานข้อมูลที่กำหนด")
    
    with st.form("nomophobia_form"):
        col_form1, col_form2 = st.columns(2)
        
        with col_form1:
            age = st.number_input("อายุของคุณ", min_value=10, max_value=80, value=18)
            daily_usage = st.slider("ชั่วโมงการใช้งานสมาร์ทโฟนต่อวัน (ชั่วโมง)", 0.0, 24.0, 5.0)
            phone_checks = st.slider("จำนวนครั้งที่หยิบหรือเช็คโทรศัพท์ต่อวัน (ครั้ง)", 0, 200, 50)
            
        with col_form2:
            screen_time_bed = st.slider("ระยะเวลาที่เล่นมือถือก่อนนอน (ชั่วโมง)", 0.0, 10.0, 1.0)
            anxiety = st.slider("ระดับความวิตกกังวล/หงุดหงิดเมื่อไม่มีมือถือใช้ (1 = น้อย, 10 = มาก)", 1, 10, 5)
            social_interactions = st.slider("ระดับการมีปฏิสัมพันธ์กับสังคมรอบข้างในชีวิตจริง (1 = น้อย, 10 = มาก)", 0, 10, 5)
            
        submit = st.form_submit_button("วิเคราะห์ผลประเมิน 🔍")
        
    if submit:
        # เทรนโมเดล ML แบบไวๆ เพื่อทำนายผล (อ้างอิงจาก Database CSV)
        features = ['Age', 'Daily_Usage_Hours', 'Phone_Checks_Per_Day', 'Screen_Time_Before_Bed', 'Anxiety_Level', 'Social_Interactions']
        X = df[features]
        y = df['Addiction_Level']
        
        # ใช้ Random Forest Model 
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # นำข้อมูลที่ผู้ใช้กรอกมาทำนาย
        input_data = pd.DataFrame([[age, daily_usage, phone_checks, screen_time_bed, anxiety, social_interactions]], columns=features)
        prediction = model.predict(input_data)[0]
        
        st.divider()
        st.subheader("📊 ผลการประเมินของคุณ")
        
        # แสดงผลคะแนน (ตัดทศนิยม 1 ตำแหน่ง)
        pred_score = min(prediction, 10.0)
        st.write(f"### ระดับความเสี่ยง Nomophobia (Addiction Level): **{pred_score:.1f} / 10**")
        
        # แสดง Progress Bar
        st.progress(int(pred_score * 10))
        
        # แปลผลลัพธ์ให้คำแนะนำ
        if pred_score >= 8.5:
            st.error("🚨 **ความเสี่ยงสูงมาก (High Risk):** คุณมีแนวโน้มเข้าข่ายเป็นโรค Nomophobia ค่อนข้างชัดเจน แนะนำให้ลองทำ Digital Detox และจำกัดเวลาการใช้หน้าจออย่างจริงจัง")
        elif pred_score >= 6.0:
            st.warning("⚠️ **ความเสี่ยงปานกลาง (Moderate Risk):** คุณเริ่มมีพฤติกรรมติดมือถือและมีความวิตกกังวลเมื่อไม่ได้ใช้งาน ลองตั้งกฎลดการเล่นมือถือก่อนนอนดูครับ")
        else:
            st.success("✅ **ความเสี่ยงต่ำ (Low Risk):** คุณสามารถจัดการพฤติกรรมการใช้สมาร์ทโฟนได้ดีเยี่ยม ไม่มีความน่ากังวลครับ")