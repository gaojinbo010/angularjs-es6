import $ from 'jquery';
import echarts from 'echarts';

class HomeController {
  
  /*@ngInject*/
  constructor($scope,httpservice) {

    console.log(this);
    this.name = '[Home Component Here]';

    console.log($scope);
    console.log(httpservice);
    this.httpservice=httpservice;
  }

  //test fn bind
  writemsg() {

    console.log(this.httpservice);
    this.datalist=this.httpservice.getData();

    console.log(this.datalist)
    console.log('this msg comes form home componet !!!');
  }

  _init() {

    console.log('init main echarts !!!');
    const myChart = echarts.init(document.getElementById('main'));
    myChart.setOption({
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [
            { value: 400, name: '搜索引擎' },
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 274, name: '联盟广告' },
            { value: 235, name: '视频广告' }
          ]
        }
      ]
    })
  }

  execute(){

    console.log('home executed !!');
  }
}

export default HomeController;
