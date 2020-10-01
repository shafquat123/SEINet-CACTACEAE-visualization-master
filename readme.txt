SEINet Cactaceae dashboard:
The SEINet Cactaceae dashboard presents a series of interactive visualizations to provide a holistic view of the dataset for North America. 

Getting Started:
These instructions will get you a copy of the project up and running on your local machine for development.

1) Open another terminal window and change directory to seinet_cactaceae_dashboard/ folder.
	cd ~/seinet_cactaceae_dashboard

2) Run python -m http.server .

Running the dashboard:
1) Open localhost:8000 in your Google chrome browser.

2) To upload an image, click on browse button.

3) Select any image present in seinet_cactaceae_dashboard/api/images folder. To upload any random image, first add that image in this folder.

Common errors:
1) If the loader keeps on running without displaying charts, verify the following:
	a) Image uploaded is from seinet_cactaceae_dashboard/api/images folder only.
	b) Backend api is up and running.
	c) Check terminal with backend api for errors.
	d) Open console in developes tool in Chrome to check for error.

2) If charts are not appearing on home page:
	a) Check if python server for frontend is up and running.
	b) Check if your internet connection is stable.

3) If you do not see any images or icons:
	a) Download the images folder as mentioned in intallation.

Authors:
1) Dhriti Shah
2) Kasturi Adep
3) Omakar Sandeep Vedak
4) Shafquat Bakhtiyar
5) Shrimangal Sanjay Rewagad

Acknowledgments
http://swbiodiversity.org/seinet/ was used to get all data set.
