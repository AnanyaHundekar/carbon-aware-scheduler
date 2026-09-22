import streamlit as st
import pandas as pd
import plotly.graph_objects as go

# ==========================================
# 🛑 FAKE DATA FUNCTIONS (Agentic Workflow Spec)
# ==========================================

def analyze_workflow(user_input):
    return [
        {
            "task_id": 1, 
            "task_name": "Customer Query Intent Classification", 
            "sla_latency_ms": 500, 
            "min_accuracy": 0.90, 
            "budget_limit": 0.010, 
            "flexible": False
        },
        {
            "task_id": 2, 
            "task_name": "Enterprise Knowledge Retrieval", 
            "sla_latency_ms": 1500, 
            "min_accuracy": 0.92, 
            "budget_limit": 0.020, 
            "flexible": True
        },
        {
            "task_id": 3, 
            "task_name": "Grounded Agent Response Synthesis", 
            "sla_latency_ms": 3000, 
            "min_accuracy": 0.95, 
            "budget_limit": 0.050, 
            "flexible": False
        }
    ]

def get_available_options(task):
    return [] 

def schedule_task(task, options, priorities):
    if task["task_id"] == 1:
        return {
            "model": "Fast-8B", "location": "US-East Regional", "time": "Immediate", 
            "accuracy": 0.91, "latency_ms": 412, "cost": 0.006, "energy": 0.4, "carbon": 0.12, 
            "reason": "Fast-8B at US-East selected over Apex-MoE. Met 500ms SLA while reducing carbon by 64% and cost by 58%.",
            "sla_pass": True, "acc_pass": True, "budget_pass": True
        }
    elif task["task_id"] == 2:
        return {
            "model": "Balanced-14B", "location": "Nordic Hydro Green DC", "time": "+2 Hours (Solar Peak)", 
            "accuracy": 0.94, "latency_ms": 1200, "cost": 0.012, "energy": 1.2, "carbon": 0.05, 
            "reason": "Time-flexible execution shifted to Nordic Hydro grid during solar peak, dropping emissions to near zero.",
            "sla_pass": True, "acc_pass": True, "budget_pass": True
        }
    else:
        return {
            "model": "Heavy-70B", "location": "Frankfurt Edge", "time": "Immediate", 
            "accuracy": 0.96, "latency_ms": 2800, "cost": 0.045, "energy": 3.8, "carbon": 1.50, 
            "reason": "Requires high accuracy (≥95%). Frankfurt Edge prioritized to hit 3000ms SLA constraint.",
            "sla_pass": True, "acc_pass": True, "budget_pass": True
        }

# ==========================================
# 🎨 DASHBOARD UI & GLASSMORPHISM CSS
# ==========================================

st.set_page_config(page_title="EcoFlow.AI Scheduler", layout="wide", initial_sidebar_state="expanded")

st.markdown("""
<style>
    /* Espresso Charcoal Background & Cream Text */
    .stApp {
        background-color: #12100E;
        color: #FAFAFA;
    }
    .block-container { padding-top: 2rem; }

    /* Typography */
    .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 15px;
        color: #FAFAFA;
    }
    .hero-title span { color: #FF6B4A; }
    .hero-subtitle {
        color: #A09E9C;
        font-size: 1.1rem;
        margin-bottom: 30px;
        line-height: 1.6;
    }

    /* Glassmorphic Global Stats */
    .metrics-row {
        display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;
    }
    .glass-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        flex: 1;
        min-width: 200px;
    }
    .glass-card .val {
        color: #FF6B4A; font-size: 2rem; font-weight: 800; margin-bottom: 4px;
    }
    .glass-card .lab {
        color: #A09E9C; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;
    }

    /* Decision Rationale Box */
    .rationale-box {
        background: linear-gradient(90deg, rgba(255,107,74,0.1) 0%, rgba(0,0,0,0) 100%);
        border-left: 4px solid #FF6B4A;
        padding: 15px;
        border-radius: 4px;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .rationale-text { color: #A09E9C; font-size: 0.9rem; }
    .rationale-text strong { color: #FAFAFA; }
    
    /* Badges */
    .badge-pass {
        background: rgba(16, 185, 129, 0.1);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.2);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        display: inline-block;
        margin-right: 8px;
    }
    
    /* Weights Chips */
    .weight-chip {
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        color: #FAFAFA;
        margin-right: 6px;
    }
    .weight-chip.active {
        color: #FF6B4A;
        border-color: rgba(255,107,74,0.3);
    }
</style>
""", unsafe_allow_html=True)

# --- HERO SECTION ---
st.markdown("""
    <div style="color: #FF6B4A; font-size: 0.85rem; font-weight: 700; letter-spacing: 1.2px; margin-bottom: 10px; text-transform: uppercase;">
        EcoFlow AI 2.0 • The Carbon-Aware Autonomous Agent Scheduler
    </div>
    <div class="hero-title">Don't just run AI.<br><span>Run AI intelligently.</span></div>
    <div class="hero-subtitle">Multi-objective scheduling for LLMs and multi-agent workflows. Mathematically balances latency SLAs, inference costs, energy grid carbon intensity, and time-shifting opportunities.</div>
""", unsafe_allow_html=True)

# --- GLOBAL STATS ROW ---
st.markdown("""
    <div class="metrics-row">
        <div class="glass-card"><div class="val">1,420+</div><div class="lab">Workflows Optimized</div></div>
        <div class="glass-card"><div class="val">482.6 kg</div><div class="lab">CO2 Emissions Avoided</div></div>
        <div class="glass-card"><div class="val">$4,120</div><div class="lab">Inference Budget Saved</div></div>
        <div class="glass-card"><div class="val">99.8%</div><div class="lab">SLA Latency Adherence</div></div>
    </div>
""", unsafe_allow_html=True)

# --- SIDEBAR (Constraints & Priorities) ---
st.sidebar.header("Agent Execution Priorities")

eco_mode = st.sidebar.checkbox("🌱 Eco Mode (Maximize Carbon/Energy Savings)")
asap_mode = st.sidebar.checkbox("⚡ Finish ASAP (Maximize Speed)")

st.sidebar.markdown("**Manual Optimization Weights**")
latency_weight = st.sidebar.slider("Latency SLA", 0.0, 1.0, 0.25)
accuracy_weight = st.sidebar.slider("Accuracy SLA", 0.0, 1.0, 0.30)
cost_weight = st.sidebar.slider("Inference Budget", 0.0, 1.0, 0.20)
carbon_weight = st.sidebar.slider("Carbon & Energy", 0.0, 1.0, 0.25)

if eco_mode:
    carbon_weight = 0.8; latency_weight = 0.1
if asap_mode:
    latency_weight = 0.8; carbon_weight = 0.1

priorities = {"latency": latency_weight, "accuracy": accuracy_weight, "cost": cost_weight, "carbon": carbon_weight}

# --- MAIN INTERACTIVE CARD ---
st.markdown("### Agentic Workflow Builder")
user_input = st.text_area(
    label="Agent Prompt / Workflow Definition", 
    value="Pipeline: 1. Classify customer intent. 2. Retrieve compliance knowledge. 3. Synthesize final response.",
    height=100
)

if st.button("⚡ Optimize Workflow", type="primary"):
    st.divider()
    
    # --- SECTION 1: Workflow Decomposition ---
    st.subheader("1. Workflow Step Decomposition & Constraints")
    tasks = analyze_workflow(user_input)
    st.dataframe(pd.DataFrame(tasks), use_container_width=True, hide_index=True)
    
    # --- SECTION 2: Dynamic Execution Decisions ---
    st.subheader("2. Optimal Execution Location & Model Selection")
    
    total_latency = 0; total_cost = 0; total_carbon = 0; total_energy = 0; task_accuracies = []
    
    for task in tasks:
        options = get_available_options(task)
        decision = schedule_task(task, options, priorities)
        
        total_latency += decision["latency_ms"]
        total_cost += decision["cost"]
        total_carbon += decision["carbon"]
        total_energy += decision["energy"]
        task_accuracies.append(decision["accuracy"])
        
        with st.expander(f"Step {task['task_id']}: {task['task_name']} ➔ {decision['model']} @ {decision['location']}"):
            
            # Badges
            st.markdown(f"""
                <div style="margin-bottom: 15px;">
                    <span class="badge-pass">✓ SLA PASS</span>
                    <span class="badge-pass">✓ ACCURACY PASS</span>
                    <span class="badge-pass">✓ BUDGET PASS</span>
                    <span style="color: #A09E9C; font-size: 0.85rem; margin-left: 10px;">Scheduled: <strong style="color: #FF6B4A;">{decision['time']}</strong></span>
                </div>
            """, unsafe_allow_html=True)
            
            # Metrics
            c1, c2, c3, c4, c5 = st.columns(5)
            c1.metric("Latency", f"{decision['latency_ms']}ms")
            c2.metric("Accuracy", f"{decision['accuracy']*100:.1f}%")
            c3.metric("Cost", f"${decision['cost']:.3f}")
            c4.metric("Energy", f"{decision['energy']} Wh")
            c5.metric("Carbon", f"{decision['carbon']}g")
            
            # Rationale
            st.markdown(f"""
                <div class="rationale-box">
                    <div style="color: #FAFAFA; font-weight: 600; margin-bottom: 4px; font-size: 0.95rem;">Decision Rationale</div>
                    <div class="rationale-text">{decision['reason']}</div>
                </div>
                <div style="margin-top: 10px;">
                    <span style="color: #A09E9C; font-size: 0.75rem; margin-right: 10px;">Applied Weights:</span>
                    <span class="weight-chip active">Carbon: {priorities['carbon']*100:.0f}%</span>
                    <span class="weight-chip">Cost: {priorities['cost']*100:.0f}%</span>
                    <span class="weight-chip">Accuracy: {priorities['accuracy']*100:.0f}%</span>
                    <span class="weight-chip">Latency: {priorities['latency']*100:.0f}%</span>
                </div>
            """, unsafe_allow_html=True)
            
    # --- SECTION 3: Digital Twin Baseline vs Optimized ---
    st.divider()
    st.subheader("3. Pipeline Performance vs Baseline (US-East H100s)")
    
    # Baseline simulation
    baseline_latency = 4500.0
    baseline_cost = 0.150
    baseline_energy = 15.0
    baseline_carbon = 6.5
    baseline_accuracy = 0.96
    
    avg_optimized_accuracy = sum(task_accuracies) / len(task_accuracies)
    
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Total Latency", f"{total_latency}ms", f"{total_latency - baseline_latency}ms", delta_color="inverse")
    c2.metric("Pipeline Cost", f"${total_cost:.3f}", f"${(total_cost - baseline_cost):.3f}", delta_color="inverse")
    c3.metric("Energy", f"{total_energy:.1f} Wh", f"{(total_energy - baseline_energy):.1f} Wh", delta_color="inverse")
    c4.metric("Carbon", f"{total_carbon:.2f}g", f"{(total_carbon - baseline_carbon):.2f}g", delta_color="inverse")
    c5.metric("Avg Accuracy", f"{avg_optimized_accuracy*100:.1f}%", f"{(avg_optimized_accuracy - baseline_accuracy)*100:.1f}%", delta_color="normal")
    
    # Plotly Chart (Dark/Terracotta)
    fig = go.Figure(data=[
        go.Bar(name='Standard Baseline', 
               x=['Latency (ms / 10)', 'Energy (Wh)', 'Carbon (g)', 'Cost ($ x 100)'], 
               y=[baseline_latency/10, baseline_energy, baseline_carbon, baseline_cost * 100], 
               marker_color='rgba(255,255,255,0.1)',
               marker_line_color='rgba(255,255,255,0.3)',
               marker_line_width=1),
        go.Bar(name='EcoFlow Scheduler', 
               x=['Latency (ms / 10)', 'Energy (Wh)', 'Carbon (g)', 'Cost ($ x 100)'], 
               y=[total_latency/10, total_energy, total_carbon, total_cost * 100], 
               marker_color='#FF6B4A')
    ])
    
    fig.update_layout(
        title_text='Agentic Workflow Optimization Savings', 
        barmode='group', 
        template='plotly_dark', 
        plot_bgcolor='rgba(0,0,0,0)', 
        paper_bgcolor='rgba(0,0,0,0)',
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    st.plotly_chart(fig, use_container_width=True)