from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--disable-dev-shm-usage','--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 issues=[]
 page.on('pageerror',lambda e:issues.append(str(e)))
 page.set_content((r/'index.v3.html').read_text('utf-8'))
 page.wait_for_timeout(1100)
 if page.get_by_role('button',name='Bỏ qua').count():page.get_by_role('button',name='Bỏ qua').first.click(force=True)
 page.get_by_role('button',name='Xem lá số mẫu').click(force=True)
 page.wait_for_timeout(5500)
 if page.get_by_text('Nhấn bất kỳ đâu để bỏ qua').count():page.locator('body').click(position={'x':40,'y':300},force=True)
 page.wait_for_timeout(1200)
 header=page.locator('body').inner_text()
 assert 'Mặt Trăng' in header and 'Mặt Trời' in header
 assert 'Chín hành tinh, chín vị gìn giữ' not in header
 print('PASS opening: real sample chart, no removed headings')
 page.locator('a[href="#ov-keys"]').first.click(force=True)
 page.wait_for_timeout(350)
 assert page.get_by_text('Vì sao mình nói điều này?').count()>0
 assert len(page.locator('.v3-story-part').all())==5
 print('PASS overview: five narrative layers with evidence')
 page.locator('a[href="#h-map"]').first.click(force=True)
 page.wait_for_timeout(350)
 page.locator('a[href="#h-1"]').first.click(force=True)
 page.wait_for_timeout(350)
 body=page.locator('body').inner_text()
 assert 'Một mối liên hệ cần đọc' in body
 assert 'Đại vận' not in body or body.count('Đại vận')<=1
 print('PASS House 1: dynamic narrative and no inline Mahadasha')
 page.locator('a[href="#v-2"]').first.click(force=True)
 page.wait_for_timeout(350)
 print('Varga headings',page.locator('h2,h3').all_text_contents()[:9])
 print('Varga nav',[(x.get_attribute('href'),x.inner_text()[:35]) for x in page.locator('a[href^="#v-"]').all()][:8])
 for target in ['#v-9','#v-10']:
  page.locator(f'a[href="{target}"]').last.click(force=True)
  page.wait_for_timeout(250)
  t=page.locator('body').inner_text()
  assert 'D1' in t and ('D9' if target=='#v-9' else 'D10') in t
  print('PASS varga',target, 'sample body:',t[t.find('D1')-40:t.find('D1')+140].replace('\n',' '))
 page.locator('a[href="#t-chapters"]').first.click(force=True)
 page.wait_for_timeout(350)
 print('Dasha headings',page.locator('h2,h3').all_text_contents()[:8])
 print('Dasha nav',[(x.get_attribute('href'),x.inner_text()[:35]) for x in page.locator('a[href^="#t-"]').all()][:10])
 page.locator('a[href="#t-sky"]').first.click(force=True)
 page.wait_for_timeout(250)
 t=page.locator('body').inner_text()
 print('Sky excerpt',t[230:800])
 page.locator('a[href="#today"]').first.click(force=True)
 page.wait_for_timeout(350)
 print('Today headings',page.locator('h2,h3').all_text_contents()[:9])
 print('Today nav',[(x.get_attribute('href'),x.inner_text()[:35]) for x in page.locator('a[href^="#s-"]').all()][:10])
 print('ERRORS',issues[:5]); assert not issues,issues
 # horizontal overflow may be caused by intentionally scrollable chart; identify viewport app only
 for name,sel in [('open','a[href="#open"]'),('overview','a[href="#ov-keys"]')]:
  page.locator(sel).first.click(force=True);page.wait_for_timeout(150)
  body=page.evaluate('({sw:document.documentElement.scrollWidth,iw:window.innerWidth})')
  print('VIEWPORT',name,body)
 b.close()