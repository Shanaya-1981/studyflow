import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function DailyPlanView({ userName, onSelectPlan, refreshTrigger }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      const response = await fetch(`/api/plans/user/${userName}`);
      const data = await response.json();
      
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPlans(sorted);
      setLoading(false);
    }
    
    fetchPlans();
  }, [userName, refreshTrigger]);

  if (loading) {
    return <div>Loading your plans...</div>;
  }

  const displayedPlans = showAll ? plans : plans.slice(0, 3);

  const formatDate = (dateValue) => {
  if (!dateValue) return 'No deadline';
  
  // If it's already a string like "2025-11-24", return as is
  if (typeof dateValue === 'string' && dateValue.length === 10) {
    return dateValue;
  }
  
  // If it's a Date object or ISO string, convert
  return new Date(dateValue).toLocaleDateString();
};



  return (
    <div>
      <h2>Your Study Plans</h2>
      {plans.length === 0 ? (
        <p>No plans yet. Create one to get started!</p>
      ) : (
        <>
          {displayedPlans.map((plan) => (
   <div 
  key={plan._id} 
  className={`plan-item ${new Date(plan.deadline) < new Date() ? 'completed' : ''}`}
  onClick={() => onSelectPlan(plan)}
>
  <h3>{plan.topic}</h3>
<p>📅 Deadline: {formatDate(plan.deadline)}</p>
<p>⏰ {plan.hours_per_day}h/day | {
  new Date(plan.deadline) < new Date() 
    ? (plan.status === 'completed' ? ' ✅ Completed' : ' ⚠️ Incomplete/Missed')
    : ' 🔄 Active'
}</p>
</div>
            
          ))}
          
          {plans.length > 3 && !showAll && (
            <button 
              className="btn-primary"
              onClick={() => setShowAll(true)}
              style={{marginTop: '10px'}}
            >
              View All ({plans.length} plans)
            </button>
          )}
        </>
      )}
    </div>
  );
}

DailyPlanView.propTypes = {
  userName: PropTypes.string.isRequired,
  onSelectPlan: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.number
};

export default DailyPlanView;