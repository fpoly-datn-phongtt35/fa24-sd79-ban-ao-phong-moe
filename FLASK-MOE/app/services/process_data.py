from app.models.json_voice_response import JsonVoiceResponse
from io import StringIO

def process_question(question):
    #TODO
    data= []
    req = StringIO()
    req.write("Bạn muốn tìm kiếm ")
    if "trạng thái" in question.lower():
        if "hết hàng" in question.lower():
            req.write("các sản phẩm có trạng thái là hết hàng")
            data.append({
                'status': 'OUT_OF_STOCK',
                'message': 'product out of stocking',
            })
        if "đang hoạt động" in question.lower():
            req.write("các sản phẩm có trạng thái là đang hoạt động")
            data.append({
                'status': 'ACTIVE',
                'message': 'product active',
            })
        if "ngừng hoạt động" in question.lower():
            req.write("các sản phẩm có trạng thái là ngừng hoạt động")
            data.append({
                'status': 'INACTIVE',
                'message': 'product inactive',
            })
    else:
        data.append({
            'keyword': question,
            'message': 'search by keyword'
        })
    

    req.write(" phải không?")
    
    response = JsonVoiceResponse(question, req.getvalue(), data).to_dict()
    return response
