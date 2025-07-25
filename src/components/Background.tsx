/**
 * Login, Sign-up, Onboarding default background img
 */
const Background = () => {
  return (
    <div>
      <img
        src="/images/signup-bg.png"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm -z-10"></div>
      <img
        src="/images/LargeLogo.png"
        alt="Logo"
        className="top-0 left-0 h-12 w-auto mt-4 ml-4 sm:h-20 -z-10"
      />
    </div>
  );
};

export default Background;
