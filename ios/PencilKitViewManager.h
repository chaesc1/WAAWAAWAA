//
//  PencilKitViewManager.h
//  WaaProject
//
//  Created by 채정훈 on 11/3/23.
//
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <PencilKit/PencilKit.h>

@interface PencilKitViewManager : RCTViewManager<PKToolPickerObserver, UIGestureRecognizerDelegate, PKCanvasViewDelegate>
@property PKCanvasView* canvasView;
@property PKDrawing* drawing;
@property PKToolPicker* toolPicker;
@property (nonatomic) NSObject* imagePath;
@property UIImageView* imageView;
@property NSUndoManager* undoManager;
@end
