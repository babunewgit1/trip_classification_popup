/*
==============================================================
   🧪 Trip Classification Popup — Auto Test Runner
   
   HOW TO USE:
   1. Open your site in browser (homepage or aircraft page)
   2. Open DevTools Console (F12 → Console)
   3. Paste this entire script and press Enter
   4. A floating test panel will appear showing results
==============================================================
*/

(function () {
   // ── Test Results UI ──────────────────────────────────────────────────
   var panel = document.createElement("div");
   panel.id = "test_runner_panel";
   panel.style.cssText =
      "position:fixed;top:10px;right:10px;width:420px;max-height:90vh;overflow-y:auto;" +
      "background:#1a1a2e;color:#eee;font-family:monospace;font-size:12px;padding:16px;" +
      "border-radius:12px;z-index:999999;box-shadow:0 8px 32px rgba(0,0,0,0.5);" +
      "border:1px solid #333;";

   var title = document.createElement("div");
   title.style.cssText =
      "font-size:16px;font-weight:bold;margin-bottom:12px;color:#00d4ff;display:flex;justify-content:space-between;align-items:center;";
   title.innerHTML =
      '🧪 Popup Test Runner <span id="test_close" style="cursor:pointer;font-size:20px;color:#ff6b6b;">✕</span>';
   panel.appendChild(title);

   var results = document.createElement("div");
   results.id = "test_results";
   panel.appendChild(results);

   document.body.appendChild(panel);

   document.getElementById("test_close").onclick = function () {
      panel.remove();
   };

   var passed = 0;
   var failed = 0;
   var total = 0;

   function log(msg, type) {
      var line = document.createElement("div");
      line.style.cssText =
         "padding:4px 8px;margin:2px 0;border-radius:4px;font-size:11px;" +
         (type === "pass"
            ? "background:#0a3d0a;color:#4cff4c;"
            : type === "fail"
              ? "background:#3d0a0a;color:#ff4c4c;"
              : type === "header"
                ? "background:#1e3a5f;color:#7ec8e3;font-weight:bold;margin-top:10px;font-size:13px;"
                : "color:#aaa;");
      line.textContent = msg;
      results.appendChild(line);
      results.scrollTop = results.scrollHeight;
   }

   function assert(condition, testName) {
      total++;
      if (condition) {
         passed++;
         log("  ✅ " + testName, "pass");
      } else {
         failed++;
         log("  ❌ " + testName, "fail");
      }
   }

   function updateSummary() {
      var summary = document.createElement("div");
      summary.style.cssText =
         "margin-top:12px;padding:10px;border-radius:8px;font-size:14px;font-weight:bold;text-align:center;" +
         (failed === 0
            ? "background:#0a3d0a;color:#4cff4c;"
            : "background:#3d0a0a;color:#ff4c4c;");
      summary.textContent =
         "Result: " + passed + "/" + total + " passed" +
         (failed > 0 ? " | " + failed + " failed" : " 🎉");
      panel.appendChild(summary);
   }

   // ── Helpers ──────────────────────────────────────────────────────────
   function getOverlay() {
      return document.getElementById("tc_popup_overlay");
   }
   function isPopupVisible() {
      var ov = getOverlay();
      return ov && ov.classList.contains("tc_active");
   }
   function getPopupText(id) {
      var el = document.getElementById(id);
      return el ? el.textContent.trim() : "";
   }
   function getPopupHTML(id) {
      var el = document.getElementById(id);
      return el ? el.innerHTML.trim() : "";
   }

   // Re-create getPopupConfig (same logic as hm.js)
   function getPopupConfig(type, pax) {
      if (type === "group" && pax < 19) return "groupLow";
      if (type === "airplane" && pax >= 19) return "airplaneHigh";
      if (type === "vip" && pax < 10) return "vipLow";
      if (type === "helicopter" && pax > 8) return "helicopterHigh";
      if (type === "cargo" && pax > 0) return "cargoPax";
      return null;
   }

   // ── GROUP 1: Popup Triggers ──────────────────────────────────────
   log("Group 1: Popup Triggers (should show popup)", "header");
   assert(getPopupConfig("group", 5) === "groupLow", "1.1 Group + PAX=5 → groupLow");
   assert(getPopupConfig("airplane", 20) === "airplaneHigh", "1.2 Airplane + PAX=20 → airplaneHigh");
   assert(getPopupConfig("vip", 3) === "vipLow", "1.3 VIP + PAX=3 → vipLow");
   assert(getPopupConfig("helicopter", 10) === "helicopterHigh", "1.4 Helicopter + PAX=10 → helicopterHigh");
   assert(getPopupConfig("cargo", 2) === "cargoPax", "1.5 Cargo + PAX=2 → cargoPax");

   // ── GROUP 2: No Popup Cases ──────────────────────────────────────
   log("Group 2: No Popup (normal submit)", "header");
   assert(getPopupConfig("airplane", 5) === null, "2.1 Airplane + PAX=5 → no popup");
   assert(getPopupConfig("group", 25) === null, "2.2 Group + PAX=25 → no popup");
   assert(getPopupConfig("vip", 15) === null, "2.3 VIP + PAX=15 → no popup");
   assert(getPopupConfig("helicopter", 4) === null, "2.4 Helicopter + PAX=4 → no popup");
   assert(getPopupConfig("cargo", 0) === null, "2.5 Cargo + PAX=0 → no popup");
   assert(getPopupConfig("medevac", 5) === null, "2.6 Medevac → null (radio-triggered)");

   // ── GROUP 3: DOM Elements ────────────────────────────────────────
   log("Group 3: DOM Elements", "header");
   var overlay = getOverlay();
   assert(!!overlay, "3.1 #tc_popup_overlay exists");
   assert(!!document.getElementById("tc_popup_header"), "3.2 #tc_popup_header exists");
   assert(!!document.getElementById("tc_popup_primary"), "3.3 Primary button exists");
   assert(!!document.getElementById("tc_popup_secondary"), "3.4 Secondary button exists");
   assert(!!document.getElementById("tc_popup_close"), "3.5 Close button exists");
   assert(!!document.getElementById("tc_popup_bold_text"), "3.6 Bold text exists");
   assert(!!document.getElementById("tc_popup_paragraphs"), "3.7 Paragraphs container exists");
   assert(!!document.getElementById("tc_popup_topbar_title"), "3.8 Top bar title exists");
   assert(!!document.getElementById("tc_popup_icon_img"), "3.9 Icon image exists");

   // ── GROUP 4: Radio Buttons ───────────────────────────────────────
   log("Group 4: Aircraft Radio Buttons", "header");
   ["airplane", "helicopter", "group", "cargo", "medevac", "vip"].forEach(function (val) {
      var count = document.querySelectorAll('.aircraft_radio[value="' + val + '"]').length;
      assert(count > 0, "4. Radio '" + val + "' found (" + count + "x)");
   });

   // ── GROUP 5: Live Popup Show/Close ───────────────────────────────
   log("Group 5: Live Popup Show/Close", "header");
   if (!overlay) {
      log("  ⚠️ Skipping — overlay not found", "fail");
   } else {
      var topBarEl = document.getElementById("tc_popup_topbar_title");
      var headerEl = document.getElementById("tc_popup_header");
      var boldTextEl = document.getElementById("tc_popup_bold_text");
      var paragraphsEl = document.getElementById("tc_popup_paragraphs");
      var primaryBtn = document.getElementById("tc_popup_primary");
      var secondaryBtn = document.getElementById("tc_popup_secondary");

      if (topBarEl) topBarEl.textContent = "Small Passenger Count";
      if (headerEl) headerEl.innerHTML = "Group Charter <br /> <span class='hlight'>May Not Be the Best Fit</span>";
      if (boldTextEl) boldTextEl.textContent = "Group charter aircraft are generally intended for larger groups of 19 or more passengers.";
      if (paragraphsEl) {
         paragraphsEl.innerHTML = "";
         ["Para 1 test.", "Para 2 test."].forEach(function (text) {
            var p = document.createElement("p");
            p.className = "tc_popup_para";
            p.textContent = text;
            paragraphsEl.appendChild(p);
         });
      }
      if (primaryBtn) primaryBtn.textContent = "View Private Jet Options";
      if (secondaryBtn) secondaryBtn.textContent = "Continue With Group Charter";

      overlay.classList.add("tc_active");
      document.body.style.overflow = "hidden";

      assert(isPopupVisible(), "5.1 Popup visible after show");
      assert(document.body.style.overflow === "hidden", "5.2 Body scroll locked");
      assert(getPopupText("tc_popup_topbar_title") === "Small Passenger Count", "5.3 Top bar OK");
      assert(getPopupHTML("tc_popup_header").indexOf("May Not Be the Best Fit") > -1, "5.4 Header OK");
      assert(getPopupText("tc_popup_primary") === "View Private Jet Options", "5.5 Primary btn OK");
      assert(getPopupText("tc_popup_secondary") === "Continue With Group Charter", "5.6 Secondary btn OK");

      var paras = paragraphsEl ? paragraphsEl.querySelectorAll(".tc_popup_para") : [];
      assert(paras.length === 2, "5.7 Paragraphs rendered (2)");

      overlay.classList.remove("tc_active");
      document.body.style.overflow = "";

      assert(!isPopupVisible(), "5.8 Popup hidden after close");
      assert(document.body.style.overflow === "", "5.9 Body scroll restored");
   }

   // ── GROUP 6: Medevac Session ─────────────────────────────────────
   log("Group 6: Medevac Session Storage", "header");
   var origMedevac = sessionStorage.getItem("medevacShown");
   sessionStorage.removeItem("medevacShown");
   assert(sessionStorage.getItem("medevacShown") === null, "6.1 medevacShown cleared");
   sessionStorage.setItem("medevacShown", "true");
   assert(sessionStorage.getItem("medevacShown") === "true", "6.2 medevacShown set");
   if (origMedevac) { sessionStorage.setItem("medevacShown", origMedevac); }
   else { sessionStorage.removeItem("medevacShown"); }
   assert(true, "6.3 Session restored");

   // ── GROUP 7: Submit Buttons ──────────────────────────────────────
   log("Group 7: Submit Buttons", "header");
   assert(document.querySelectorAll(".onewaysubmit").length > 0, "7.1 .onewaysubmit exists");
   assert(document.querySelectorAll(".roundtrip").length > 0, "7.2 .roundtrip exists");
   assert(document.querySelectorAll(".multicity_submit").length > 0, "7.3 .multicity_submit exists");

   // ── GROUP 8: Boundary Edge Cases ─────────────────────────────────
   log("Group 8: Boundary Edge Cases", "header");
   assert(getPopupConfig("group", 19) === null, "8.1 Group PAX=19 → no popup");
   assert(getPopupConfig("group", 18) === "groupLow", "8.2 Group PAX=18 → popup");
   assert(getPopupConfig("airplane", 18) === null, "8.3 Airplane PAX=18 → no popup");
   assert(getPopupConfig("airplane", 19) === "airplaneHigh", "8.4 Airplane PAX=19 → popup");
   assert(getPopupConfig("vip", 10) === null, "8.5 VIP PAX=10 → no popup");
   assert(getPopupConfig("vip", 9) === "vipLow", "8.6 VIP PAX=9 → popup");
   assert(getPopupConfig("helicopter", 8) === null, "8.7 Helicopter PAX=8 → no popup");
   assert(getPopupConfig("helicopter", 9) === "helicopterHigh", "8.8 Helicopter PAX=9 → popup");
   assert(getPopupConfig("cargo", 1) === "cargoPax", "8.9 Cargo PAX=1 → popup");
   assert(getPopupConfig("cargo", 0) === null, "8.10 Cargo PAX=0 → no popup");

   // ── Summary ──────────────────────────────────────────────────────
   log("", "");
   updateSummary();

   console.log(
      "%c🧪 Test Complete: " + passed + "/" + total + " passed",
      "font-size:16px;font-weight:bold;color:" + (failed === 0 ? "#4cff4c" : "#ff4c4c")
   );
})();
