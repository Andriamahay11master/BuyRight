export default function OnboardingPage() {
  return (
    <div className="onboarding-body">
      <div className="onboarding-top">
        <h1 className="title-h1">BuyRight</h1>
        <p>Your smart shopping companion</p>
      </div>
      <div className="onboarding-content">
        <div className="w-full aspect-square rounded-lg bg-cover bg-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Plan your meals
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create weekly meal plans and shopping lists with ease.
          </p>
        </div>
        <div className="w-full aspect-square rounded-lg bg-cover bg-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Shop efficiently
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your shopping by aisle and track your spending.
          </p>
        </div>
      </div>
      <div className="onboarding-footer">
        <button className="btn btn-primary">Get Started</button>
      </div>
    </div>
  );
}
