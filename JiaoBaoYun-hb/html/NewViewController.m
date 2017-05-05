//
//  NewViewController.m
//  JiaoBao
//
//  Created by Zqw on 17/5/5.
//  Copyright © 2017年 JSY. All rights reserved.
//

#import "NewViewController.h"

@interface NewViewController ()

@end

@implementation NewViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    UIButton *btn;
    btn = [[UIButton alloc]initWithFrame:CGRectMake(0, 20, 418, 760)];
    [btn setTitle:@"sdfdsfd" forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(haha:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
}
-(void)haha:(id)sender{
    NSLog(@"btn被点击了");
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
