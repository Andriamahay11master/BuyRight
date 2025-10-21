export default function OnboardingPage() {
  return (
    <div className="onboarding-body">
      <div className="onboarding-top">
        <h1 className="title-h1">BuyRight</h1>
        <p>Your smart shopping companion</p>
      </div>
      <div className="onboarding-content">
        <div className="onboarding-item">
          <img
            className="onboarding-img"
            src="/onboarding-meal.png"
            alt="grocery image meal"
            title="grocery image meal"
          />
          <h3 className="title-h3">Plan your meals</h3>
          <p>Create weekly meal plans and shopping lists with ease.</p>
        </div>
        <div className="onboarding-item">
          <img
            className="onboarding-img"
            src="/onboarding-shop.png"
            alt="grocery image shop"
            title="grocery image shop"
          />
          <h3 className="title-h3">Shop efficiently</h3>
          <p>Organize your shopping by aisle and track your spending.</p>
        </div>
      </div>
      <div className="onboarding-footer">
        <button className="btn btn-primary">Get Started</button>
      </div>
    </div>
  );
}
