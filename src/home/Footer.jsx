import "./footer.css";

// أضفنا قيم افتراضية هنا (Default parameters)
export default function Footer({ 
  className = "", 
  bgColor,   // قيمة احتياطية فاتحة
  thumbColor, // قيمة احتياطية داكنة
}) {
  return (
    <div 
      className={`footer ${className}`} 
      style={{ backgroundColor: thumbColor, color: bgColor }} 
    > 
      <div className="footer-content">
        <div className="footer-brand">
          <img
            src="/assets/background/______________removed_bg_2026-02-15T01-32-16.png"
            alt="Family Group Logo"
            className="footer-logo"
          />

          <div className="brand-text">
            <h2 style={{ color: bgColor }}>FAMILY GROUP</h2> 
            <p className="footer-description" style={{ color: bgColor }}>
              We specialize in modern web development, creating fast, secure, and
              visually appealing websites tailored to your business needs.
            </p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="footer-social">
          {[
            { href: "https://www.tiktok.com/@familygroup974", icon: "fab fa-tiktok" },
            { href: "https://x.com/FamilyGroup8320", icon: "fab fa-x-twitter" },
            { href: "https://www.linkedin.com/in/family-group-69a419395", icon: "fab fa-linkedin-in" },
            { href: "https://github.com/family50", icon: "fab fa-github" },
            { href: "https://mail.google.com/mail/?view=cm&fs=1&to=familygroup832005@gmail.com", icon: "fa-solid fa-envelope" }
          ].map((social, index) => (
            <a 
              key={index}
              href={social.href} 
              className="social-icon custom-social-icon"
              style={{ 
                "--icon-bg": bgColor,
                "--icon-color": thumbColor,
                "--hover-bg": thumbColor,
                "--hover-color": bgColor
              }}
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
      </div>

      {/* إضافة الـ 33 بعد الـ hex تجعل اللون شفافاً قليلاً للحدود السفلي */}
      <div className="footer-bottom" style={{ borderTop: `1px solid ${bgColor}33`, color: bgColor }}>
        © 2026 FAMILY GROUP. All rights reserved.
      </div>
    </div>
  );
}