<template>
    <div class="container mt-5">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Privacy Policy</h5>
          <p class="text-muted"><i>Last Updated: 10/15/2024</i></p>
  
          <p>At <strong>Dining Information Served Here (DISH)</strong>, we prioritize your privacy and are committed to ensuring that your personal data is protected. We value transparency and want to assure you that <strong>DISH</strong> operates in a way that fully respects your privacy.</p>
  
          <h4>1. Information Collection</h4>
          <p>We do not collect, store, or process any personal information from our users. <strong>DISH</strong> is designed to provide information regarding dining hall menus and services without requiring any form of data input from our users.</p>
  
          <h4>2. Use of Data</h4>
          <p>Since we do not collect any personal information, we do not use or process user data for any purpose.</p>
  
          <h4>3. Third-Party Services</h4>
          <p><strong>DISH</strong> does not integrate with any third-party services or tools that would involve the collection, processing, or sharing of user data. No personal information will be transmitted to or accessed by third parties through your interaction with <strong>DISH</strong>.</p>
  
          <h4>4. Cookies and Tracking Technologies</h4>
          <p><strong>DISH</strong> does not use cookies, web beacons, or other tracking technologies to monitor or collect any information about your visit. Your browsing activity on <strong>DISH</strong> is not tracked, and no personal data is collected during your use of our service.</p>
  
          <h4>5. Data Sharing and Selling</h4>
          <p>We do not and will never sell, trade, or share any user data because we do not collect any information from you. Your privacy and anonymity are fully protected when using <strong>DISH</strong>.</p>
  
          <h4>6. Security</h4>
          <p>Although we do not collect any personal data, we still take necessary precautions to ensure that <strong>DISH</strong> is a secure environment for our users. We regularly update our systems and protocols to maintain security and protect against potential threats.</p>
  
          <h4>7. Changes to This Privacy Policy</h4>
          <p>This privacy policy may be updated from time to time to reflect changes in the operation of <strong>DISH</strong> or for legal and regulatory reasons.</p>
  
          <h4>8. Contact Us</h4>
          <p>If you have any questions or concerns about this privacy policy, please feel free to contact us at:</p>
  
          <p>
            <strong>Dining Information Served Here (DISH)</strong><br>
            Email: <a class="text-light" :href="'mailto:' + CONTACT_EMAIL">{{CONTACT_EMAIL}}</a> <br>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const CONTACT_EMAIL = import.meta.env.VITE_APP_CONTACT_EMAIL;
  </script>
  