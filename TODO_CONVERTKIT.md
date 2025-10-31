# 🔔 REMINDER: Complete ConvertKit Setup

## Tasks to Complete Later

### 3. Create Custom Fields in ConvertKit

**URL:** https://app.convertkit.com/subscribers/custom_fields

Create these custom fields for subscriber segmentation:

- [ ] **industry** (Text field)
- [ ] **goals** (Text field)
- [ ] **martech_stack** (Text field)

These fields will automatically populate when users:
- Subscribe to the newsletter
- Request the full 90-day roadmap

---

### 4. Set Up Automations

#### Newsletter Automation

**Create at:** https://app.convertkit.com/automations

- [ ] Create new Visual Automation
- [ ] **Trigger:** "Subscribes to a form" → Select your Newsletter Form
- [ ] **Action:** Send email → "Welcome to PersX.ai Newsletter"
- [ ] Activate automation

**Welcome Email Should Include:**
- Welcome message
- What they can expect from the newsletter
- Unsubscribe/preferences link

---

#### Roadmap Automation

**Create at:** https://app.convertkit.com/automations

- [ ] Create new Visual Automation
- [ ] **Trigger:** "Subscribes to a form" → Select your Roadmap Form
- [ ] **Action:** Send email → "Your Full 90-Day Roadmap"
- [ ] Attach or link to roadmap PDF/document
- [ ] Activate automation

**Roadmap Email Should Include:**
- Thank you message
- The full 90-day personalization roadmap
- Next steps or CTA
- Personalization based on custom fields (optional):
  - "Based on your industry: {{industry}}"
  - "Goals you selected: {{goals}}"
  - "Your martech stack: {{martech_stack}}"

---

## Notes

- These tasks should be completed AFTER you've:
  - Added ConvertKit API credentials to environment variables
  - Created the Newsletter and Roadmap forms
  - Tested the API integration

- Full instructions available in: `CONVERTKIT_SETUP.md`

---

**When Ready:** Delete this file after completing the tasks above.
